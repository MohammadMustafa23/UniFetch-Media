import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "./env.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,

  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },

  requireTLS: true,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export default transporter;