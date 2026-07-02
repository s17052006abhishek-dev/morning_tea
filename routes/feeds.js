const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Feed=require("../models/feed.js");
const {feedSchema}=require("../schema.js");




const validateFeed=(req, res, next)=>{
    let {error}=feedSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//today route
router.get("/:category", wrapAsync(async (req, res) => {
    const category = req.params.category;

    const feeds = await Feed.find({ category });
    if (feeds.length === 0) {
        req.flash("error","no feed for this category");
        return res.redirect("/feed");
    }

    const today = new Date();

    const dayNumber = Math.floor(
        today.getTime() / (1000 * 60 * 60 * 24)
    );

    const feed = feeds[dayNumber % feeds.length];
    let isLiked = false;

    if(req.user){
        isLiked=feed.likedBy.some(
            id=>id.equals(req.user._id)
        );
    }

    res.render("feed/today.ejs",{feed,isLiked});
}));

module.exports=router;

