const InvariantError = require('../../exceptions/InvariantError');
const { ItemsPostPayloadSchema, CategoryPostPayloadSchema } = require('./schema');

const ItemsValidator = {
  validateItemPayload: (payload) => {
    const validationResult = ItemsPostPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateCategoryPayload: (payload) => {
    const validationResult = CategoryPostPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  
};

module.exports = ItemsValidator;
