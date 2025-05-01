import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

const registerUser = asyncHandler(async(req,res) => {
    const {fullname, email, password} = req.body;
    console.log("Printing User : ", req.body);

      if (
        [fullname, email, username, password].some(
          (field) => field?.trim() === ""
        )
      ) {
        throw new ApiError(400, "All fields are reuired");
      }

      const existedUser = await User.findOne({email});

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