import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {Note} from "../models/note.model.js";
import { User } from "../models/user.model.js";

const createNote = asyncHandler(async(req,res) => {

    const user = req.user;

    const {title, content, tags} = req.body;

    if(!title || !content){
        throw new ApiError(400, "Title and content are required");
    }

    const note = await Note.create({
        title,
        content,
        tags,
        owner : user._id,
    })

    if(!note){
        throw new ApiError(500, "Note can not be made");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, note , "Note created successfully")) ;

})


const getNote = asyncHandler(async(req,res) => {
    // const user = await User.findById(req.user._id);

    const notes = await Note.find({owner : req.user._id});

    return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));

})

export {
    createNote,
    getNote,
}