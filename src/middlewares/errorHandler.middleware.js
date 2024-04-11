import mongoose from "mongoose";

export default class ApplicationError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof ApplicationError) {
    res.status(err.code).json({
      success: false,
      message: err.message,
    });
  } else if (err.code == 11000) {
    res.status(500).json({
      success: false,
      message: "Email already registerd, Please check the email and try again",
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
