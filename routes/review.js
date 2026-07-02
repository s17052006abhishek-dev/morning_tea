const express=require("express");
const router=express.Router({mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Feed=require("../models/feed.js");
const Review=require("../models/review.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");




//Reviews crete route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

//review destroy route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;