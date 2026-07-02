const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const Feed=require("./models/feed.js");
const Review=require("./models/review.js");
const {feedSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.get("referer");
        req.flash("error","You must be have an account to perform this action!");
        return res.redirect("/user/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next(); 
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let feed=await Feed.findById(id);
    if(!feed.owner.equals(res.locals.currUser._id)){
        req.flash("error","you don't have access to perform this action!");
        return res.redirect(`/feed/${id}`);
    }
    next();
}

module.exports.validateFeed=(req, res, next)=>{
    let {error}=feedSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validateReview=(req, res, next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params; 
    let review=await Review.findById(reviewId);  
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you don't have access to perform this action!");
        return res.redirect(`/feed/${id}`);
    }
    next();   
}
