import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { OtpToken } from "../models/OtpToken.model.js";
import { generateOtp, getExpiry } from "../services/otpService.js";
import { sendOtpMail } from "../utils/mailer.js";


// this function genrates the refresh and accesstoken 
// and the refreshToken is saved in user schema

const generateAccessAndRefreshToken = async (userId) => {
  try{
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false})

    return {accessToken, refreshToken}

  }
  catch(error){
    
  }
}


const sendOtpForRegistration = asyncHandler(async(req,res) => {
    const {fullname, email, password} = req.body;
    // console.log("Printing User : ", req.body);

      if (
        [fullname, email, password].some(
          (field) => field?.trim() === ""
        )
      ) {
        throw new ApiError(400, "All fields are reuired");
      }

      const existedUser = await User.findOne({email});

      if(existedUser){
        throw new ApiError(409, "User with this email already exists");      
      }

      const otpCode = generateOtp();
      const hashedOtp = await bcrypt.hash(otpCode,10);

      await OtpToken.findOneAndUpdate(
        { email },
        {
          fullname,
          email,
          otp: hashedOtp,
          password,
          expiry : getExpiry(),
        },
        { upsert: true, new: true, runValidators: true }
      );


      await sendOtpMail(email, otpCode);

      res.status(200)
      .json(new ApiResponse(200, otpCode, "OTP sent successfully to your email"));

      
})


const verifyOtpAndRegister = asyncHandler(async (req,res) => {
    const {email,otp} = req.body;

    const otpRecord = await OtpToken.findOne({email});
    if(!otpRecord){
      throw new ApiError(400,"OTP expired or not requested");
    }

    const {fullname,password} = otpRecord;

    if (otpRecord.expiry < Date.now()) {
      await OtpToken.deleteOne({ email });
      throw new ApiError(400, "OTP expired");
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
    if(!isOtpValid){
      throw new ApiError(400, " Invalid OTP");
    }



    const user = await User.create({
      fullname,
      email,
      password,
    });

    await OtpToken.deleteOne({ email });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered Successfully"));


})


const loginUser = asyncHandler(async(req,res) => {
  const {email , password} = req.body ;

  if(!email || !password) {
    throw new ApiError(400,"All Field are required");
  }

  const user = await User.findOne({email});

  if(!user){
    throw new ApiError(400,"User does not exist , please register");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid){
    throw new ApiError(401,"Wrong Password");
  }


  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)


  // send cookies

  const loggedInUser = await User.findById(user._id).
  select("-password -refreshToken")


  const options = {
    httpOnly : true,
    secure : true,
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {user : loggedInUser, accessToken, refreshToken},"User logged in successfully"));

})


const logoutUser = asyncHandler(async (req,res) => {
  // console.log(req.user);
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set : {
        refreshToken : null
      }
    },
    {
      new : true
    }
  )

  const options = {
    httpOnly : true,
    secure : true
  }


  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logegd out successfully"))


})


export {
  sendOtpForRegistration,
  verifyOtpAndRegister,
  loginUser,
  logoutUser
}