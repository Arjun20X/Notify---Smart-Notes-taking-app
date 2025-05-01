import { asyncHandler } from "../utils/asyncHandler";

const registerUser = asyncHandler(async(req,res) => {
    const {fullname, email, password} = req.body;
    console.log("Printing User : ", req.body);

})