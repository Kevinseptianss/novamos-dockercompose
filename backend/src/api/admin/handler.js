/* eslint-disable no-underscore-dangle */
class AdminHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAdmin = this.postAdmin.bind(this);
    this.postAdminLogin = this.postAdminLogin.bind(this);
    this.postAdminForgot = this.postAdminForgot.bind(this);
    this.getAdmin = this.getAdmin.bind(this);
    this.getAdminAll = this.getAdminAll.bind(this);
    this.getAdminByUsername = this.getAdminByUsername.bind(this);
    this.putAdmin = this.putAdmin.bind(this);
    this.deleteAdmin = this.deleteAdmin.bind(this);
  }

  async postAdmin(request, h) {
    const { username, password, question, answer } = request.payload;
    const admin = await this._service.addAdmin({
      username,
      password,
      question,
      answer,
    }); 
    return h
      .response({
        status: "success",
        message: "Admin added successfully",
        data: {
          admin,
        },
      })
      .code(201);
  }

  async postAdminLogin(request, h) {
    const { username, password } = request.payload;
  
    // Validate the payload
    if (!username || !password) {
      return h.response({
        status: "fail",
        message: "Username and password are required",
      }).code(400);
    }
  
    // Authenticate the admin
    const admin = await this._service.authenticateAdmin(username, password);
  
    if (!admin) {
      return h.response({
        status: "fail",
        message: "Invalid username or password",
      }).code(401);
    }
    
    const token = "loggedin";
  
    return h.response({
      status: "success",
      message: "Admin logged in successfully",
      data: {
        token,
      },
    }).code(200);
  }

  async postAdminForgot(request, h) {
    const { username, answer, newpassword } = request.payload;
  
    // Validate the payload
    if (!username || !answer || !newpassword) {
      return h.response({
        status: "fail",
        message: "Username and answer are required",
      }).code(400);
    }
  
    // Authenticate the admin
    const admin = await this._service.forgotAdmin(username, answer, newpassword);
  
    if (!admin) {
      return h.response({
        status: "fail",
        message: "Invalid username or password",
      }).code(401);
    }
    
    const token = "loggedin";
  
    return h.response({
      status: "success",
      message: "Admin password change successfully",
      data: {
        token,
      },
    }).code(200);
  }

  async getAdminAll(request, h) {
    const admin = await this._service.getAdminAll();

    if (admin) {
      return h
        .response({
          status: "success",
          message: "Admin found",
          data: {
            admin,
          },
        })
        .code(200);
    } else {
      return h
        .response({
          status: "failed",
          message: "Admin Not Found",
        })
        .code(404);
    }
  }

  async getAdmin(request, h) {
    const { adminId } = request.params;
    const admin = await this._service.getAdminById(adminId);

    if (admin) {
      return h
        .response({
          status: "success",
          message: "Admin found",
          data: {
            admin,
          },
        })
        .code(200);
    } else {
      return h
        .response({
          status: "failed",
          message: "Admin Not Found",
        })
        .code(404);
    }
  }

  async getAdminByUsername(request, h) {
    const { username } = request.params;
    const admin = await this._service.getAdminByUsername(username);

    if (admin) {
      return h
        .response({
          status: "success",
          message: "Admin found",
          data: {
            admin,
          },
        })
        .code(200);
    } else {
      return h
        .response({
          status: "failed",
          message: "Admin Not Found",
        })
        .code(404);
    }
  }

  async putAdmin(request, h) {
    const { adminId } = request.params;
    const { username, password } = request.payload;

    await this._service.editAdminById(adminId, {
      username,
      password
    });

    return h
      .response({
        status: "success",
        message: "Admin updated successfully",
      })
      .code(200);
  }

  async deleteAdmin(request, h) {
    const { adminId } = request.params;
    await this._service.deleteAdminById(adminId);

    return h
      .response({
        status: "success",
        message: "Admin deleted successfully",
      })
      .code(200);
  }
}

module.exports = AdminHandler;
