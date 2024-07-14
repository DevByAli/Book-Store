import Joi from "joi";

const UpdateEmailValidator = Joi.object({
  oldEmail: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.email": "Email must be a valid email",
    "string.empty": "Email cannot be an empty field",
    "any.required": "Please provide the user email",
  }),

  newEmail: Joi.string()
    .email()
    .required()
    .invalid(Joi.ref("oldEmail")) // Ensure newEmail is different from oldEmail
    .messages({
      "string.base": "Email should be a type of text",
      "string.email": "Email must be a valid email",
      "string.empty": "Email cannot be an empty field",
      "any.required": "Please provide the user email",
      "any.invalid": "New email must be different from the old email",
    }),

  confirmEmail: Joi.string()
    .valid(Joi.ref("newEmail")) // Ensure confirmEmail matches newEmail
    .required()
    .messages({
      "any.only": "New and confirm email do not match", // Custom message for equality check
    }),

  password: Joi.string().required().messages({
    "string.empty": "Password cannot be an empty field",
    "any.required": "Please provide the user password",
  }),
});

export default UpdateEmailValidator;
