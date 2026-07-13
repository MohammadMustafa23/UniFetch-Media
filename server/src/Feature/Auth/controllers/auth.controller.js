import User from "../../../models/user.model.js";
import bcrypt from "bcryptjs";
import generateOTP from "../utils/generateOTP.js";
import { redisClient } from "../../../config/redis.js";
import sendOTP from "../utils/sendOTPEmail.js";
import jwt from "jsonwebtoken";

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

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    
    // Password Check
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

      const token = jwt.sign({
        id: user._id,
      },process.env.JWT_SECRET,{
        expiresIn: "7d",
      });

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { RegisterUser, LoginUser };
