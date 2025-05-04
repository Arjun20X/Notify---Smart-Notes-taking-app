import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

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
        default : null
    }
},{timestamps : true}
)


// "save" event is launched
//  pre() hook is used to have access to all the elements of the schema

// This is a Mongoose middleware function — specifically a “pre-save hook”.
// It runs before saving a user document to the database.
// Why?
// Because we want to hash (encrypt) the password before storing it, so no 
// one (not even the developer or database admin) can see the original password.
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


// makiing a custom method for validating the password
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


// making custom method for genrating access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email : this.email,
            fullname : this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        
        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        } 
    );
};




export const User = mongoose.model("User", userSchema);