const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    currentStreak:{
        type:Number,
        default:0
    },
    highestStreak:{
        type:Number,
        default:0
    },
    lastLoginDate:{
        type:Date
    },
    preferredCategories:[{
        type:String,
        enum:[
            "motivational",
            "natural-fact",
            "news",
            "fitness",
            "spiritual"
        ]
    }],
    profileImage:{
        url:{
            type:String,
            default:"https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" 
        },
        filename:{
            type:String,
            default:"default-profile"
        },

    },
    bio:{
        type:String,
        maxlength:150,
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);