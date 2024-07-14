import Joi from "joi";

const UpdatePasswordValidator = Joi.object({
  oldPassword: Joi.string()
    .required()
    .messages({
      "string.empty": "Password cannot be an empty field",
      "any.required": "Please provide the user password",
    }),

  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .invalid(Joi.ref("oldPassword"))
    .messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password cannot be an empty field",
      "string.min": "Password should have a minimum length of {#limit}",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "any.required": "Please provide the user password",
      "any.invalid": "New password must be different from the old password",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "New and confirm passwords do not match", 
    }),
});

export default UpdatePasswordValidator;
