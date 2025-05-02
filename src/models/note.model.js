import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title : {
            type : String
        },
        content : {
            type : String,
            required : true,
        },
        tags:[
            {
                type : String,
            }
        ],
        owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "USer",
            // required : true,
        }
    },{timestamps : true}
)

export const Note = mongoose.model("Note", noteSchema);