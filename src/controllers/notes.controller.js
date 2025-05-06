import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {Note} from "../models/note.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

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


const updateNote = asyncHandler(async(req,res) => {
  const userId = req.user._id;
  const { noteId } = req.params;

  const { title, content, tags } = req.body;

  // Validate noteId
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "Invalid Note ID");
  }

  // get that note
  const note = await Note.findOne({ _id: noteId, owner: userId });

  // validate note
  if (!note) {
    throw new ApiError(400, "Note not found or not authorized");
  }

  // update provided fields
  if (title) note.title = title;
  if (content) note.content = content;
  if (tags) note.tags = tags;


  const updatedNote = await note.save();

  return res
  .status(200)
  .json(new ApiResponse(200, updateNote, "Notes updated successfully"));

})


const deleteNote = asyncHandler(async(req,res) => {
  const userId = req.user._id;
  const {noteId} = req.params;

  if(!noteId){
    throw new ApiError(400,"Note id is required");
  }

    const note = await Note.findOne({ _id: noteId, owner: userId });

    if (!note) {
      throw new ApiError(404, "Note not found or unauthorized");
    }

  await Note.deleteOne({_id:noteId});

  return res
  .status(200)
  .json(new ApiResponse(200, "Note deleted Successfully"));

})


export {
    createNote,
    getNote,
    updateNote,
    deleteNote
}