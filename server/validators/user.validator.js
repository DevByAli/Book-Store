import Joi from "joi";

const UserValidator = Joi.object({
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
    }),

  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.email": "Email must be a valid email",
    "string.empty": "Email cannot be an empty field",
    "any.required": "Please provide the user email",
  }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password cannot be an empty field",
      "string.min": "Password should have a minimum length of {#limit}",
      "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "any.required": "Please provide the user password",
    }),

  role: Joi.string().valid("admin", "user").default("user").messages({
    "string.base": "Role should be a type of text",
    "any.only": "Role must be either 'admin' or 'user'",
  }),

  avatar: Joi.string().optional().allow("").messages({
    "string.base": "Avatar should be a type of text",
  }),

  cloudinaryId: Joi.string().optional().allow("").messages({
    "string.base": "Cloudinary ID should be a type of text",
  }),
});

export default UserValidator;
