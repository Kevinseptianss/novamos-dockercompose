// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");

const VoucherPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),
  description: Joi.string().required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "any.required": "Description is required",
  }),
  expired: Joi.date().required().messages({
    "date.base": "Expired must be a valid date",
    "any.required": "Expired date is required",
  }),
  value: Joi.string() // Change from number to string
    .required()
    .messages({
      "string.base": "Value must be a string",
      "string.empty": "Value cannot be empty",
      "any.required": "Value is required",
    }),
  type: Joi.string().required().messages({
    "string.base": "Type must be a string",
    "string.empty": "Type cannot be empty",
    "any.required": "Type is required",
  }),
  min: Joi.number().integer().required().messages({
    "number.base": "Min must be a number",
    "number.integer": "Min must be an integer",
    "any.required": "Min is required",
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

module.exports = { VoucherPayloadSchema };
