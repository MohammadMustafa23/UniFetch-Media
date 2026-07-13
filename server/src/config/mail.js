import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "./env.js";


console.log(EMAIL_PASS,EMAIL_USER);


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export default transporter;
