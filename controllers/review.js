const Review=require("../models/review.js");
const Feed=require("../models/feed.js");

module.exports.createReview=async(req, res)=>{
    let {id}=req.params;
    const feed=await Feed.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    feed.reviews.push(newReview);
    await newReview.save();
    await feed.save();
    req.flash("success","commented successfully!")
    res.redirect(`/feed/${id}`);
}

module.exports.destroyReview=async(req, res)=>{
   let {id,reviewId}=req.params;
   await Feed.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","comment deleted successfully!")
   res.redirect(`/feed/${id}`);
}