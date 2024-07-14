import Joi from "joi";

const orderItemSchema = Joi.object({
  book: Joi.string().hex().length(24).required().messages({
    "string.base": "Book ID should be a type of text",
    "string.empty": "Book ID cannot be an empty field",
    "any.required": "Please provide the book ID for the order.",
    "string.hex": "Book ID must be a valid hexadecimal string",
    "string.length": "Book ID must be 24 characters long",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity should be a type of number",
    "number.min": "Quantity should be at least {#limit}",
    "any.required": "Please provide the book quantity for the order.",
  }),
});

const shippingAddressSchema = Joi.object({
  line1: Joi.string().required().messages({
    "string.base": "line1 address should be a type of text",
    "string.empty": "line1 address cannot be an empty field",
    "any.required": "Please provide the line1 address for the order.",
  }),
  line2: Joi.string().allow(null).optional().messages({
    "string.base": "Line2 address should be a type of text",
  }),
  city: Joi.string().required().messages({
    "string.base": "City should be a type of text",
    "string.empty": "City cannot be an empty field",
    "any.required": "Please provide the city for the order.",
  }),
  postal_code: Joi.string().required().messages({
    "string.base": "Postal code should be a type of text",
    "string.empty": "Postal code cannot be an empty field",
    "any.required": "Please provide the postal code for the order.",
  }),
  country: Joi.string().required().messages({
    "string.base": "Country should be a type of text",
    "string.empty": "Country cannot be an empty field",
    "any.required": "Please provide the country for the order.",
  }),
  state: Joi.string().allow(null).optional().messages({
    "string.base": "State should be a type of text",
  }),
});

const paymentResultSchema = Joi.object({
  paymentIntent: Joi.string().required().messages({
    "string.base": "Stipe session id should be a type of text",
    "string.empty": "Stipe session id cannot be an empty field",
    "any.required": "Please provide the stripe session id for the order.",
  }),
  refundId: Joi.string().required().messages({
    "string.base": "Stipe refund id should be a type of text",
    "string.empty": "Stipe refund id cannot be an empty field",
    "any.required": "Please provide the stripe refund id for the order.",
  }),
});

const OrderValidator = Joi.object({
  user: Joi.string().hex().length(24).required().messages({
    "string.base": "User ID should be a type of text",
    "string.empty": "User ID cannot be an empty field",
    "any.required": "Please provide the user ID for the order.",
    "string.hex": "User ID must be a valid hexadecimal string",
    "string.length": "User ID must be 24 characters long",
  }),
  items: Joi.array().items(orderItemSchema).min(1).required().messages({
    "array.base": "Items should be an array",
    "array.min": "Items should contain at least {#limit} item",
    "any.required": "Please provide the items for the order.",
  }),
  totalAmount: Joi.number().messages({
    "number.base": "Total amount should be a type of number",
  }),
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .default("pending")
    .messages({
      "string.base": "Status should be a type of text",
      "any.only": "Status must be one of the following values: {#valids}",
    }),
  shippingAddress: shippingAddressSchema.required(),
  paymentResult: paymentResultSchema.required(),
});

export default OrderValidator;
