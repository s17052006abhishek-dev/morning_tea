const express=require("express");
const router=express.Router({mergeParams: true });
const User=require("../models/user.js");
const passport=require("passport");
const {isLoggedIn, saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage});


router
    .route("/signup")
    .get(userController.renderSignup)
    .post(upload.single("profileImage"),userController.signup)

router
    .route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:'/user/login',failureFlash:true}),userController.login)

router
    .route("/profile")
    .get(isLoggedIn,userController.profile);

router
    .route("/profile/edit")
    .get(isLoggedIn,userController.renderEditForm);

router
    .route("/:id")
    .put(upload.single("profileImage"),userController.userUpdate);

router.post("/logout",isLoggedIn,userController.logout);

module.exports=router;