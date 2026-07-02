const User=require("../models/user.js");
const Feed=require("../models/feed.js");
const { cloudinary } = require("../cloudConfig");

module.exports.renderSignup=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signup=async(req, res)=>{
    try{
        let {username,email,password,preferredCategories}=req.body;
        const newUser=new User({email,username,preferredCategories});
        if(typeof(req.file)!=="undefined"){
            let url=req.file.path;
            let filename=req.file.filename;
            newUser.profileImage={url,filename};
        }
        if(!preferredCategories){
            req.flash("error","Please select at least one preferred category.");
            return res.redirect("/user/signup");
        }
        if(!Array.isArray(preferredCategories)){
            preferredCategories=[preferredCategories];
        }
        const registereduser=await User.register(newUser,password);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Morning Tea");
            return res.redirect("/feed");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/user/signup");
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login=async(req,res)=>{
    const user=req.user;
    const today=new Date();
    today.setHours(0,0,0,0);

    if(user.lastLoginDate){
        const lastLogin=new Date(user.lastLoginDate);
        lastLogin.setHours(0,0,0,0);
        const diffDays=Math.floor(
            (today-lastLogin)/(1000*60*60*24)
        );
        if(diffDays===1){
            user.currentStreak+=1;
        }
        else if(diffDays>1){
            user.currentStreak=1;
        }
    }
    else{
        user.currentStreak=1;
    }
    user.highestStreak=Math.max(
        user.highestStreak,
        user.currentStreak
    );
    user.lastLoginDate=today;
    await user.save();
    req.flash("success","WelcomeBack to Morning Tea");
    let redirectUrl=res.locals.redirectUrl||"/feed";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged out successfully!");
        res.redirect("/user/signup");
    })
}

module.exports.profile=async(req,res)=>{
    const createdPosts=await Feed.find({
        owner:req.user._id,
    });
    const likedPosts=await Feed.find({
        likedBy:req.user._id
    });
    let totalLikesReceived=0;
    createdPosts.forEach(post => {
        totalLikesReceived += post.likedBy.length;
    });
    res.render("user/profile.ejs", {
        user:req.user,
        createdPosts,
        likedPosts,
        totalLikesReceived
    });
}

module.exports.renderEditForm=(req,res)=>{
    res.render("user/edit.ejs",{user:req.user});
}

module.exports.userUpdate=async(req,res)=>{
    const user=await User.findById(req.user._id);
    user.username=req.body.username;
    user.email=req.body.email;
    if(req.body.preferredCategories){
        user.preferredCategories=Array.isArray(req.body.preferredCategories)?req.body.preferredCategories:[req.body.preferredCategories];
    }else{
        user.preferredCategories=["motivational"];
    }
    if(req.file){
        if(user.profileImage&&user.profileImage.filename&&user.profileImage.filename!=="default_profile"){
            await cloudinary.uploader.destroy(user.profileImage.filename);
        }
        user.profileImage={
            url:req.file.path,
            filename:req.file.filename,
        };
    }
    await user.save();
    req.login(user,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Profile updated successfully.");
        return res.redirect("/user/profile");
    })
}
