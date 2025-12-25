import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

/* REGISTER (SEND OTP) */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    if (user) {
      user.name = name;
      user.password = hashed;
      await user.save();
    } else {
      user = await User.create({ name, email, password: hashed });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    console.log(otp);

    await sendEmail(email, otp);
    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    user.isVerified = true;
    await user.save();
    await Otp.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.isVerified) return res.status(400).json({ msg: "Please verify your email first" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GOOGLE LOGIN */
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        // Ensure verified if logging in via Google
        if (!user.isVerified) user.isVerified = true;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true,
        // No password for google-only users
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token: jwtToken, userId: user._id, name: user.name });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

export default router;
