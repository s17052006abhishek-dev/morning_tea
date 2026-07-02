if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}



const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const feedRouter=require("./routes/feed.js");
const feedsRouter=require("./routes/feeds.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const newsRouter=require("./routes/news.js");
const session=require("express-session");
const MongoStore=require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");







//const MONGO_URL='mongodb://127.0.0.1:27017/morning_tea';
const dbURL=process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connected to database.")
}).catch((err)=>{
    console.log(err);
});




async function main() {
    await mongoose.connect(dbURL);
}

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("err",()=>{
    console.log("error in mongo session",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+3*24*60*60*1000,
        maxAge:3*24*60*60*1000,
        httpOnly:true,
    },
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res, next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/feed",feedRouter);
app.use("/feeds",feedsRouter);
app.use("/feed/:id/reviews",reviewRouter);
app.use("/news",newsRouter);
app.use("/user",userRouter);


app.use((req, res, next)=>{
    next(new ExpressError(404,"Page not found."));
});
//error handling middlewares
app.use((err, req, res, next)=>{
    // res.send("something went wrong.");
    let {status=420, message="chorie"}=err;
    res.status(status).render("error.ejs",{err});
});



app.listen(8080,()=>{
    console.log("server is listening to port 8080.")
});