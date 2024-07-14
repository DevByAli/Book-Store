import Joi from "joi";

const ActivationValidator = Joi.object({
  token: Joi.string().required().messages({
    "string.base": "token should be a type of text",
    "string.empty": "token cannot be an empty field",
    "any.required": "Please provide the token for the activation.",
  }),

  userActivationCode: Joi.string().required().messages({
    "string.base": "Email Verification Code should be a type of text",
    "string.empty": "Email Verification Code cannot be an empty field",
    "any.required":
      "Please provide the Email Verification Code for the activation.",
  }),
});

export default ActivationValidator;
