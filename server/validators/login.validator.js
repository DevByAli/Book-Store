import Joi from "joi";

const LoginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.email": "Email must be a valid email",
    "string.empty": "Email cannot be an empty field",
    "any.required": "Please provide the user email",
  }),

  password: Joi.string().required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password cannot be an empty field",
    "any.required": "Please provide the password for login.",
  }),
});

export default LoginValidator;
