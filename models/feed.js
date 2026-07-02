const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js")

const feedSchema=new Schema({
    title:{
        type: String,
        required :true,
    },
    description:{
        type: String,
        required:true,
    },
    image:{
        url:{
            type: String,
            default:"/images/default.png",
        },
        filename:{
            type: String,
            default:"default.png",
        },  
    },
    category:{
        type:String,
        required:true,
        enum:["motivational","natural-fact","fitness","spiritual"],
    },
    likes: {
        type:Number,
        default:0,
    },
    info:{
        type:String,
        required:true,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

});

feedSchema.post("findOneAndDelete",async(feed)=>{
    if(feed){
        await Review.deleteMany({_id :{$in:feed.reviews}});
    }
})

const Feed=mongoose.model("Feed",feedSchema);
module.exports=Feed;