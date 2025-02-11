const InvariantError = require('../../exceptions/InvariantError');
const { VoucherPayloadSchema } = require('./schema');

const VoucherValidator = {
  validateVoucherPayload: (payload) => {
    const validationResult = VoucherPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = VoucherValidator;
