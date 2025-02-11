const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object({
    otp: Joi.string().required(),
    uniq: Joi.string().required(),
    phone: Joi.string().required(),
});

const PutAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = {
    PostAuthenticationPayloadSchema,
    PutAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema,
}