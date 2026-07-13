import User from "../../../models/user.model.js";
import bcrypt from "bcrypt";
import generateOTP from "../utils/generateOTP.js";
import { redisClient } from "../../../config/redis.js";
import  sendOTP from "../utils/sendOTPEmail.js";

async function RegisterUser(req, res) {
  const { userName, email, password } = req.body;

  // 1. Check Email Exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists.",
    });
  }

  // 2. Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  //   3. Generate OTP
  const otp = generateOTP();

  console.log(otp);

  // Redis Key
  const cacheKey = `register:${email}`;
  await redisClient.set(
    `register:${email}`,
    JSON.stringify({
      userName,
      email,
      password: hashedPassword,
      otp,
    }),
    {
      EX: 300,
    },
  );

  // 5. Send OTP Email
  await sendOTP(email, otp);

  // 6. Success Response
  return res.status(200).json({
    success: true,
    message: "OTP sent successfully.",
  });
}

export { RegisterUser };
