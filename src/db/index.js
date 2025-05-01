import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async() => {
    try{
        const conectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST : ${conectionInstance.connection.host}`);
    }
    catch(error){
        console.log("MongoDb Connection Failed : ", error)
        process.exit(1);
    }
}

export default connectDB