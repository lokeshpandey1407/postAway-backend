import { body, validationResult } from "express-validator";

export const PostValidation = async (req, res, next) => {
  const rules = [
    body("title").notEmpty().withMessage("Title should not be empty"),
    body("imageurl").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Image is required");
      }
      return true;
    }),
  ];
  await Promise.all(rules.map((rule) => rule.run(req)));

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Unauthorized",
      data: validationErrors.errors,
    });
  } else {
    next();
  }
};
