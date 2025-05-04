import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


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


const registerUser = asyncHandler(async(req,res) => {
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

      const user = await User.create({
        fullname,
        email,
        password,
      })

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
          .status(201).json(
            new ApiResponse(200,createdUser, "User registered Successfully")
          )
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
  registerUser,
  loginUser,
  logoutUser
}