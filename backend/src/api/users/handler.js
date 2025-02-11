const { sendMessage } = require("../../../utils");

/* eslint-disable no-underscore-dangle */
class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    this.postOtp = this.postOtp.bind(this);
    this.checkOtp = this.checkOtp.bind(this);
    this.postUser = this.postUser.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  async postOtp(request, h) {
    this._validator.validatePhonePayload(request.payload);
    console.log(request.payload);
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
    console.log(request.auth.credentials);
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

  // ------------------------------------------------------------------------------------------------

  async postNoteHandler(request, h) {
    this._validator.validateNotePayload(request.payload);
    const { title = "untitled", body, tags } = request.payload;

    const noteId = await this._service.addNote({ title, body, tags });

    const response = h.response({
      status: "success",
      message: "Catatan berhasil ditambahkan",
      data: {
        noteId,
      },
    });
    response.code(201);
    return response;
  }

  async getNotesHandler() {
    const notes = await this._service.getNotes();
    return {
      status: "success",
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler(request) {
    const { id } = request.params;
    const note = await this._service.getNoteById(id);
    return {
      status: "success",
      data: {
        note,
      },
    };
  }

  async putNoteByIdHandler(request) {
    this._validator.validateNotePayload(request.payload);
    const { id } = request.params;

    await this._service.editNoteById(id, request.payload);

    return {
      status: "success",
      message: "Catatan berhasil diperbarui",
    };
  }

  async deleteNoteByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteNoteById(id);

    return {
      status: "success",
      message: "Catatan berhasil dihapus",
    };
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
