import Joi from "joi";

const UpdateUsernameValidator = Joi.object({
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

  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password cannot be an empty field",
      "any.required": "Please provide the user password",
    }),
});

export default UpdateUsernameValidator;
