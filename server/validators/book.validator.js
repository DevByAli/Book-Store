import Joi from "joi";

// Define error messages
const errorMsg = (field) => `Please provide the book ${field}.`;

// Define Joi schema for Book model
const bookValidator = Joi.object({
  title: Joi.string()
    .trim()
    .required()
    .min(3)
    .messages({
      "any.required": errorMsg("title"),
      "string.empty": errorMsg("title"),
      "string.min": "Title must be at least 3 characters long.",
    }),
  author: Joi.string()
    .trim()
    .required()
    .min(3)
    .messages({
      "any.required": errorMsg("author"),
      "string.empty": errorMsg("author"),
      "string.min": "Author must be at least 3 characters long.",
    }),
  price: Joi.number()
    .required()
    .min(0)
    .messages({
      "any.required": errorMsg("price"),
      "number.base": "Price must be a number.",
      "number.min": "Price must be greater than or equal to 0.",
    }),
  description: Joi.string()
    .trim()
    .required()
    .min(20)
    .messages({
      "any.required": errorMsg("description"),
      "string.empty": errorMsg("description"),
      "string.min": "Description must be at least 20 characters long.",
    }),
  tags: Joi.array()
    .items(Joi.string())
    .required()
    .min(1)
    .messages({
      "any.required": errorMsg("tags"),
      "array.base": "Tags must be an array of strings.",
      "array.min": "Tags must contain at least one tag.",
    }),
  purchased: Joi.number().default(0).messages({
    "number.base": "Purchased must be a number.",
  }),
  url: Joi.string()
    .required()
    .messages({
      "any.required": errorMsg("Cover Photo"),
      "string.empty": errorMsg("Cover Photo"),
    }),
  cloudinaryId: Joi.string()
    .required()
    .messages({
      "any.required": errorMsg("cloudinary id"),
      "string.empty": errorMsg("cloudinary id"),
    }),
});

export default bookValidator;
