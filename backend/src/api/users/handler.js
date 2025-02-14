const { sendMessage } = require("../../../utils");

/* eslint-disable no-underscore-dangle */
class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postOtp = this.postOtp.bind(this);
    this.checkOtp = this.checkOtp.bind(this);
    this.postUser = this.postUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getUsersAdmin = this.getUsersAdmin.bind(this);
  }

  async postOtp(request, h) {
    this._validator.validatePhonePayload(request.payload);
    const { phone } = request.payload;
    const otp = generateOTP();
    const uniq = generateUniqueId();
    const result = await this._service.addOTP({ otp, uniq });
    if (result) {
      await sendMessage(`62${phone}`, `Kode OTP anda : ${otp}`);
      return h
        .response({
          message: "OTP sent successfully",
          data: {
            uniq: uniq,
          },
        })
        .code(201);
    } else {
      return h.response({ message: "Failed to send OTP" }).code(500);
    }
  }

  async checkOtp({ otp, uniq }) {
    const result = await this._service.checkOTP({ otp, uniq });
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async postUser(request, h) {
    this._validator.validateRegisterPayload(request.payload);
    const { otp, uniq, name, email, phone } = request.payload;
    if (await this.checkOtp({ otp, uniq })) {
      const user = await this._service.addUser({ name, email, phone });
      await this._service.deleteOTP(uniq);
      return h
        .response({
          status: "success",
          message: "User added successfully",
          data: {
            user,
          },
        })
        .code(201);
    } else {
      return h.response({ message: "Invalid OTP" }).code(400);
    }
  }

  async getUser(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const result = await this._service.getUser(credentialId);
    if (result) {
      return h
        .response({
          status: "success",
          message: "User found",
          data: {
            user: result,
          },
        })
        .code(200);
    } else {
      return h
        .response({
          status: "failed",
          message: "User Not Found",
        })
        .code(404);
    }
  }

  async getUsersAdmin(request, h) {
    const result = await this._service.getUserAdmin();
    if (result) {
      return h
        .response({
          status: "success",
          message: "User found",
          data: {
            user: result,
          },
        })
        .code(200);
    } else {
      return h
        .response({
          status: "failed",
          message: "User Not Found",
        })
        .code(404);
    }
  }
}

function generateOTP() {
  return Math.floor(Math.random() * 9000) + 1000;
}

function generateUniqueId(length = 16) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

module.exports = UsersHandler;
