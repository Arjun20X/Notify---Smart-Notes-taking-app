import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async(req,res) => {
    const {fullname, email, password} = req.body;
    console.log("Printing User : ", req.body);

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

  if(user.password !== password){
    throw new ApiError(401,"Wrong Password");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, "User logged in successfully"));

})


export {
  registerUser,
  loginUser
}