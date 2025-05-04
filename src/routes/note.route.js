import { Router } from "express";
import { createNote, getNote } from "../controllers/notes.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createNote); 

router.route("/get").get(verifyJWT,getNote);

export default router