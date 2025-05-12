// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");

const ItemsPostPayloadSchema = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must be at most 100 characters long",
    "any.required": "Title is required",
  }),
  description: Joi.string().required().min(10).messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 10 characters long",
    "any.required": "Description is required",
  }),
  price: Joi.number().required().greater(0).messages({
    "number.base": "Price must be a number",
    "number.greater": "Price must be greater than 0",
    "any.required": "Price is required",
  }),
  category_id: Joi.string().required().messages({
    "string.base": "Category ID must be a string",
    "string.empty": "Category ID cannot be empty",
    "any.required": "Category ID is required",
  }),
  weight: Joi.number().required().greater(0).messages({
    "number.base": "Weight must be a number",
    "number.greater": "Weight must be greater than 0",
    "any.required": "Weight is required",
  }),
  images: Joi.array()
    .items(
      Joi.object({
        hapi: Joi.object({
          filename: Joi.string().required(),
          headers: Joi.object().optional(), // Allow headers to be present
        }).required(),
        _data: Joi.binary().required(),
      }).unknown()
    ) // Allow unknown properties in the image object
    .required()
    .messages({
      "array.base": "Images must be an array",
      "any.required": "Images are required",
    }),
});

const CategoryPostPayloadSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must be at most 100 characters long",
    "any.required": "Name is required",
  }),
  image: Joi.object({
    hapi: Joi.object({
      filename: Joi.string().required(),
      headers: Joi.object().optional(), // Allow headers to be present
    })
      .required()
      .unknown(), // Allow unknown properties in the hapi object
    _data: Joi.binary().required(),
  })
    .required()
    .unknown()
    .messages({
      "object.base": "Image must be an object",
      "any.required": "Image is required",
    }),
});

module.exports = {
  ItemsPostPayloadSchema,
  CategoryPostPayloadSchema,
};
