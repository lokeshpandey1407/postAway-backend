import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import { totp } from "otplib";
import BlacklistRepository from "./blacklists/blacklist.repository.js";
import sendMail from "../../config/nodemailer.config.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
    this.blacklistRepository = new BlacklistRepository();
  }
  async getUsers(req, res, next) {
    try {
      if (req.userRole !== "Admin") {
        res.status(401).json({
          success: false,
          message: "Unauthorised Access. Please contact Admin.",
        });
      }
      const users = await this.userRepository.getAllUsers();
      res.status(200).json({
        success: true,
        message: "",
        data: users,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      if (req.userRole !== "Admin") {
        res.status(401).json({
          success: false,
          message: "Unauthorised Access. Please contact Admin.",
        });
      }
      let id = req.params.id;
      const user = await this.userRepository.getUserById(id);
      if (user) {
        res.status(200).json({
          success: true,
          message: "",
          data: user,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No user found for the given ID",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async addUser(req, res, next) {
    try {
      const { name, gender, role, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await this.userRepository.signup({
        name,
        gender,
        role,
        email,
        password: hashedPassword,
        posts: [],
      });
      res.status(201).json({
        success: true,
        message: "",
        data: user,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) {
        res.status(400).json({
          success: false,
          message: "Invalid Credentials",
        });
      } else {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
          const token = jwt.sign(
            { userId: user._id, userRole: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
          );
          // save the token in cookies and send
          res.cookie("authToken", token, {
            path: "/",
            maxAge: 2 * 24 * 60 * 60 * 1000,
          });
          res.status(200).json({
            success: true,
            message: "Successfully logged In.",
            data: token,
          });
        } else {
          res.status(400).json({
            success: false,
            message: "Invalid Credentials",
          });
        }
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async signOut(req, res) {
    const token = req.cookies.authToken;
    if (!token)
      return res.status(401).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    await this.blacklistRepository.addToBlacklist(token);
    res.clearCookie("authToken");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }

  async sendResetPasswordOtp(req, res, next) {
    try {
      const { email } = req.body;
      const isValid = this.userRepository.isValidUser(email);
      if (!isValid) {
        res.status(404).json({
          success: false,
          message: "User not valid, Please enter a valid email and try again.",
        });
      } else {
        //generating otp
        const secret = process.env.OTP_SECRET_KEY;
        totp.options = { digits: 6, algorithm: "sha512", epoch: 0 };
        const token = totp.generate(secret);
        await sendMail("lokesh.pandey1407@gmail.com", email, token);
        res.status(200).json({
          success: true,
          message: "Otp sent to your registered Email id.",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { otp, newPassword, email } = req.body;
      const secret = process.env.OTP_SECRET_KEY;
      totp.options = { digits: 6, algorithm: "sha512", epoch: 0 };
      const isValidOtp = totp.check(otp, secret);
      console.log(isValidOtp);

      console.log(req.body);
      if (isValidOtp) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const user = await this.userRepository.resetPassword(
          email,
          hashedPassword
        );
        if (user) {
          res
            .status(200)
            .json({ success: true, message: "Password Changed successfully" });
        } else {
          res.status(400).json({
            success: false,
            message: "Failed to update password, Please try again",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid OTP.",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  //pending
  //Admin
  async deleteUser(req, res) {}

  //pending
  //Admin
  async updateRole(req, res) {}
}
