import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required : true,
        trim : true,
        index : true
    },
    email : {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
    },
    refreshToken : {
        type:String,
    }
},{timestamps : true}
)

export const User = mongoose.model("User", userSchema);