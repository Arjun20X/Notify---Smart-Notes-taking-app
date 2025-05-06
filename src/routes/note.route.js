import { Router } from "express";
import { createNote, deleteNote, getNote, updateNote } from "../controllers/notes.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createNote); 

router.route("/get").get(verifyJWT,getNote);

router.route("/update/:noteId").put(verifyJWT, updateNote);

router.route("/delete/:noteId").delete(verifyJWT, deleteNote);

export default router