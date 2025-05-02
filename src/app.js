import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
  })
);

app.use(express.json({limit : "16kb"}));

app.use(express.urlencoded({extended: true, limit : "16kb"}))

app.use(cookieParser());

// app.get('/',(req,res) => {
//     res.send("HELLO NOTIFY");
// })

import userRouter from './routes/user.route.js'
import noteRouter from './routes/note.route.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/notes",noteRouter)

export {app};