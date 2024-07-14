import Joi from "joi";

export const AddTagsValidator = Joi.object({
  tag: Joi.string().required().messages({
    "string.base": "Tag should be an string",
    "any.required": "Tag is a required field",
  }),
});

export const UpdateTagValidator = Joi.object({
  tagId: Joi.string().required().messages({
    "any.required": "Tag Id is a required field",
    "string.base": "Tag Id should be a string",
  }),
  tag: Joi.string().required().messages({
    "any.required": "Tag is a required field",
    "string.base": "Tag should be a string",
  }),
});

export const DeleteTagValidtor = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Tag Id is a required field",
    "string.base": "Tag Id should be a string",
  }),
});
