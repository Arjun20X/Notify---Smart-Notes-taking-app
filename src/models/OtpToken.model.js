import mongoose, { mongo, Schema } from "mongoose";

const otpTokenSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  expiry : {
    type : Date,
    required : true
  },
});

export const OtpToken = mongoose.model("OtpToken", otpTokenSchema);