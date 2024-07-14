import Joi from "joi";

const EmailVerificationValidator = Joi.object({
  token: Joi.string().required().messages({
    "string.base": "token should be a type of text",
    "string.empty": "token cannot be an empty field",
    "any.required": "Please provide the token for the activation.",
  }),
});

export default EmailVerificationValidator;
