// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const UsersPhonePayloadSchema = Joi.object({
  phone: Joi.string().required(),
});

const UserRegisterPayloadSchema =  Joi.object({
  otp: Joi.string().required(),
  uniq: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});


module.exports = { UsersPhonePayloadSchema, UserRegisterPayloadSchema };
