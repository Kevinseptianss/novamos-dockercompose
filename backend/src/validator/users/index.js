const InvariantError = require('../../exceptions/InvariantError');
const { UsersPhonePayloadSchema, UserRegisterPayloadSchema } = require('./schema');

const UsersValidator = {
  validatePhonePayload: (payload) => {
    const validationResult = UsersPhonePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateRegisterPayload: (payload) => {
    const validationResult = UserRegisterPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  
};

module.exports = UsersValidator;
