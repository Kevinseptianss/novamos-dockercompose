const path = require('path'); // Import path module for handling file paths
const fs = require("fs");
/* eslint-disable no-underscore-dangle */
class VoucherHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getVoucher = this.getVoucher.bind(this);
    this.postVoucher = this.postVoucher.bind(this);
    this.putVoucher = this.putVoucher.bind(this);
    this.deleteVoucher = this.deleteVoucher.bind(this);
  }

  async getVoucher(request, h) {
    try {
      const vouchers = await this._service.getVouchers();
      return h.response({
        status: 'success',
        data: {
          vouchers,
        },
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(500);
    }
  }

  async postVoucher(request, h) {
    try {
      this._validator.validateVoucherPayload(request.payload); // Validate the payload
      const { name, description, expired, value, type, min } = request.payload;
      const image = request.payload.image; // Get the uploaded image file
  
      // Ensure the uploads directory exists
      const uploadsDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
  
      // Generate a random filename while preserving the original file extension
      const originalExtension = path.extname(image.hapi.filename); // Get the original file extension
      const randomFileName = `${generateRandomString()}${originalExtension}`; // Generate a random filename with the original extension
  
      // Save the uploaded image to the uploads directory
      const writeStream = fs.createWriteStream(path.join(uploadsDir, randomFileName));
      writeStream.write(image._data);
      writeStream.end();
  
      // Add the Voucher to the database, including the image filename
      const VoucherId = await this._service.addVoucher({
        name,
        description,
        expired,
        value,
        type,
        min,
        image: randomFileName, // Save the filename of the uploaded image
      });
  
      return h.response({
        status: 'success',
        data: {
          VoucherId,
        },
      }).code(201);
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(400);
    }
  }

  async putVoucher(request, h) {
    try {
      const { id } = request.params;
      const { name, description, expired, value, type, min } = request.payload;

      await this._service.updateVoucher(id, {
        name,
        description,
        expired,
        value,
        type,
        min,
      });

      return h.response({
        status: 'success',
        message: 'Voucher updated successfully',
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(400);
    }
  }

  async deleteVoucher(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteVoucher(id); // Delete the Voucher by ID

      return h.response({
        status: 'success',
        message: 'Voucher deleted successfully',
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(400);
    }
  }
}

const generateRandomString = (length = 16) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

module.exports = VoucherHandler;