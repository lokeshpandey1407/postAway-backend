import { body, validationResult } from "express-validator";

export const UserValidation = async (req, res, next) => {
  const rules = [
    body("name").notEmpty().withMessage("Name should not be empty"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isStrongPassword()
      .withMessage(
        "Password should contain atleast one capital letter, one number and one special character"
      ),
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
