const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,validateFeed}=require("../middleware.js");
const axios = require("axios");


//news route
router.get("/", async (req, res) => {
    try {
        const response = await axios.get(`https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=10&apikey=${process.env.GNEWS_API_KEY}`);
        const news = response.data.articles;
        res.render("feed/news.ejs", { news });
    } catch (err) {
        console.log("Status:",err.response?.status);
        console.log("Data:",err.response?.data);
        console.log("Message:",err.message);
        res.send("Failed to fetch news.");
    }
});

module.exports=router;