const Feed=require("../models/feed.js");

module.exports.index=(req, res)=>{
    res.render("feed/index.ejs");
}

module.exports.createFeed=async (req,res)=>{
    const newFeed=new Feed(req.body.feed);
    newFeed.owner=req.user._id;
    if(req.file!==undefined){
        let url=req.file.path;
        let filename=req.file.filename;
        newFeed.image={url,filename};
    }
    await newFeed.save();
    req.flash("success","feed created successfully");
    res.redirect("/user/profile");
}

module.exports.renderCreateForm=(req,res)=>{
    res.render("feed/new.ejs");
}

module.exports.showFeed=async(req,res)=>{
    let {id}=req.params;
    const feed=await Feed.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!feed){
        req.flash("error","feed doesn't exits!");
        return res.redirect("/feed");
    }
    res.render("feed/show.ejs",{feed});
}



module.exports.renderEditForm=async (req, res)=>{
    let {id}=req.params;
    const feed=await Feed.findById(id);
    if(!feed){
        req.flash("error","feed doesn't exits!")
        return res.redirect("/feed");
    }
    let originalImageUrl=feed.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("feed/edit.ejs",{feed,originalImageUrl});
}

module.exports.updateFeed=async (req, res)=>{
    let {id}=req.params;
    let newFeed=await Feed.findByIdAndUpdate(id,{...req.body.feed});
    if(typeof(req.file)!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        newFeed.image={url,filename};
        await newFeed.save();
    }
    
    req.flash("success","feed updated successfully!")
    res.redirect(`/feed/${id}`);
}

module.exports.destroyFeed=async (req,res)=>{
    let {id}=req.params;
    const feed=await Feed.findByIdAndDelete(id);
    req.flash("success","feed deleted successfully!")
    res.redirect("/user/profile");
}

module.exports.likeFeed=async(req,res)=>{
    const feed=await Feed.findById(req.params.id);
    const alreadyLiked=feed.likedBy.some(
        id=>id.equals(req.user._id)
    );
    if(alreadyLiked) {
        feed.likes--;
        feed.likedBy.pull(req.user._id);
    }else{
        feed.likes++;
        feed.likedBy.push(req.user._id);
    }
    await feed.save();
    res.redirect(req.get("referer"));
}