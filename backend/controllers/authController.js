import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/mailer.js";
import crypto from "crypto";


export const checkUserName = async (req, res) => {
    const { userName } = req.body;
    try {
        const checkUserName = await User.findOne({ userName });
        if (checkUserName) {
            return res.status(400).json({ message: "Username already exists!" });
        }
        return;
    } catch (error) {
        console.log(error);
        res.json({ message: "Something went wrong!", error });
    }
}

export const Register = async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;

    try {

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists!" });
        }
        const hashPassowrd = bcrypt.hashSync(password, 12);
        const otp = crypto.randomBytes(25).toString('base64').slice(0, 25).replace(/[^a-zA-Z0-9]/g, '');
        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            verificationOtp: otp,
            password: hashPassowrd,
            otpCreatedAt: new Date()
        });
        const verificationLink = `http://yourdomain.com/verifyemail?username=${user.userName}&otp=${otp}&id=${user._id}`;

        res.status(201).json({ message: "User created successfully!", user });

        sendMail({
            to: email,
            subject: "Email verification",
            body: `<!DOCTYPE html>
    <html>
      <head>
        <title>Email Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #CC72F2; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Verify Your Email</h1>
          </div>
          <div style="padding: 20px; color: #333333;">
            <p style="font-size: 16px; line-height: 1.5;">
              Hi ${firstName}, 
              <br><br>
              Thank you for signing up. Please verify your email address to activate your account. Click the button below or copy and paste the link into your browser to verify your email:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${verificationLink}" style="display: inline-block; background-color: #CC72F2; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                Verify Email
              </a>
            </div>
            <p style="font-size: 16px; line-height: 1.5; text-align: center;">
              Or copy and paste this link into your browser:
            </p>
            <p style="font-size: 14px; color: #555555; word-wrap: break-word; text-align: center; border: 1px solid #dddddd; padding: 10px; border-radius: 5px; background-color: #f9f9f9;">
              ${verificationLink}
            </p>
            <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">
              If you did not request this email, please ignore it. This link will expire in 24 hours.
            </p>
            <p style="font-size: 14px; color: #555555; margin-top: 30px; text-align: center;">
              &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>`
        })
    } catch (error) {
        console.log(error);
        res.json({ message: "Something went wrong!", error });
    }
}

export const verifyEmail = async (req, res) => {
    const { userName, otp, _id } = req.query;
    try {
        const user = await User.findById(_id);
        const otpMatch = user.verificationOtp === otp;
        const otpExpired = new Date() - user.otpCreatedAt > 24 * 60 * 60 * 1000;
        if (otpExpired) {
            return res.status(400).json({ message: "Link expired!" });
        }
        if (!otpMatch) {
            return res.status(400).json({ message: "Invalid OTP!" });
        }
        if (otpMatch) {
            await User.findByIdAndUpdate(_id, { isVerified: true });
            return res.status(200).json({ message: "Email verified successfully!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!", error });
    }
}

export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const cehckUser = await User.findOne({ email });
        const checkUserName = await User.findOne({ userName });
        if (!cehckUser || checkUserName) {
            return res.status(400).json({ message: "Username or Email Id Not Found" });
        }
        const checkPassword = bcrypt.compare(password, cehckUser.password);
        if (!checkPassword) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: "Something went wrong!", error });
    }
}