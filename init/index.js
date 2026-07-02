
const mongoose=require("mongoose");
const Feed=require("../models/feed.js");
const initdata=require("./data.js");

const MONGO_URL='mongodb://127.0.0.1:27017/morning_tea';
main().then(()=>{
    console.log("connected to database.")
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Feed.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'6a393b9f0d3b672b79d8d9fd'}));
    await Feed.insertMany(initdata.data);
    console.log("data was initialized.");
}
initDB();
