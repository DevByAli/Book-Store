import Joi from "joi";

const RegisterValidator = Joi.object({
  username: Joi.string()
    .min(3)
    .pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
    .required()
    .messages({
      "string.base": "Username should be a type of text",
      "string.empty": "Username cannot be an empty field",
      "string.min": "Username should have a minimum length of {#limit}",
      "string.pattern.base": "Username should only contain alphabets",
      "any.required": "Please provide the user name",
      "string.trim": "Username cannot contain only spaces",
    }),

  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.email": "Email must be a valid email",
    "string.empty": "Email cannot be an empty field",
    "any.required": "Please provide the user email",
    "string.trim": "Email cannot contain only spaces",
  }),

  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password cannot be an empty field",
      "string.min": "Password should have a minimum length of {#limit}",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "any.required": "Please provide the user password",
    }),
});

export default RegisterValidator;
