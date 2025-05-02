import { Router } from "express";
import { createNote } from "../controllers/notes.controller.js";

const router = Router();

router.route("/create").post(createNote); 

export default router