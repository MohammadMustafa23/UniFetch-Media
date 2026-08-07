import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "./env.js";


console.log("EMAIL_USER:", EMAIL_USER);
console.log("EMAIL_PASS exists:", EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});
export default transporter;