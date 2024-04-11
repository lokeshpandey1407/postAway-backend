import nodemailer from "nodemailer";
import ApplicationError from "../middlewares/errorHandler.middleware.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lokesh.pandey1407@gmail.com",
    pass: "tagfbblnbfvhcdmx",
  },
});

async function sendMail(from, to, otp) {
  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
      from: from,
      to: to,
      subject: "Password Reset OTP for Your Account",
      text: `
            Dear User,
  
            We have received a request to reset the password for your account associated with the email address: ${to}.
            Your One-Time Password (OTP) to proceed with the password reset is: ${otp}.
            Please use the above OTP to reset your password. This OTP is valid for the next 10 minutes. If you did not request this password reset, please ignore this email.
  
            Thank you.
  
            Best regards,
            Team PostAway`,
    });
    console.log("Otp generated successfully.");
  } catch (err) {
    console.log(err);
    throw new ApplicationError(
      "Some error occured while generating otp, please try again after some time",
      500
    );
  }
}
export default sendMail;
