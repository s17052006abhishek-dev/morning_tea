const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Feed=require("../models/feed.js");
const {isLoggedIn,isOwner,validateFeed}=require("../middleware.js");
const feedController=require("../controllers/feed.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage});
 


router
    .route("/")
    .get(feedController.index)
    .post(isLoggedIn,validateFeed,upload.single("feed[image]"),wrapAsync(feedController.createFeed))


// new route
router.get("/new",isLoggedIn,feedController.renderCreateForm)


//show route
router
    .route("/:id")
    .get(wrapAsync(feedController.showFeed))
    .put(isLoggedIn,isOwner,upload.single("feed[image]"),validateFeed,wrapAsync(feedController.updateFeed))
    .delete(isLoggedIn,isOwner,wrapAsync(feedController.destroyFeed))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(feedController.renderEditForm))

//like route
router.post("/:id/like",isLoggedIn,feedController.likeFeed);
module.exports=router;
