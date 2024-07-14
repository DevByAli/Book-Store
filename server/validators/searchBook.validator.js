import Joi from "joi";
const SearchBookValidator = Joi.object({
  query: Joi.string().required().messages({
    'string.base': 'Query should be a type of text',
    'string.empty': 'Query cannot be an empty field.',
    'any.required': 'Please provide the query for the searching books.',
  }),
  deepSearch: Joi.string().optional().messages({
    'string.base': 'DeepSearch should be a type of text',
  }),
  pageNumber: Joi.number().integer().positive().optional(),
  pageSize: Joi.number().integer().positive().optional(),
  price: Joi.string().optional(),
  purchased: Joi.string().optional(),
  title: Joi.string().optional(),
  author: Joi.string().optional(),
  dateAdded: Joi.string().optional(),
});
export default SearchBookValidator;
