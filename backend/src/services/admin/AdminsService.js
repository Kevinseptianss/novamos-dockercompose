/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class AdminsService {
  constructor() {
    this._pool = pool;
  }

  async addAdmin({ username, password, question, answer }) {
    // Check if the username already exists
    const checkQuery = {
      text: "SELECT id FROM admin WHERE username = $1",
      values: [username],
    };

    const checkResult = await this._pool.query(checkQuery);

    if (checkResult.rows.length > 0) {
      throw new InvariantError("Username already exists");
    }

    // Proceed to insert the new admin
    const query = {
      text: "INSERT INTO admin (username, password, question, answer) VALUES($1, $2, $3, $4) RETURNING id",
      values: [username, password, question, answer],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Admin failed to add");
    }

    return result.rows[0].id;
  }

  async authenticateAdmin(username, password) {
    const query = {
      text: "SELECT * FROM admin WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      return null; // Admin not found
    }

    const admin = result.rows[0];

    // Perform plain text password matching
    if (admin.password !== password) {
      return null; // Invalid password
    }

    return admin; // Return the admin object if authentication is successful
  }

  async forgotAdmin(username, answer, newpassword) {
    const query = {
      text: "SELECT * FROM admin WHERE username = $1 AND answer = $2",
      values: [username, answer],
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError("Admin not found");
    } else {
      const query = {
        text: "UPDATE admin SET password = $1 WHERE username = $2",
        values: [newpassword, username],
      };
      await this._pool.query(query);
      return newpassword;
    }
  }

  async getAdminById(id) {
    const query = {
      text: "SELECT * FROM admin WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError("Admin not found");
    }

    return result.rows[0];
  }

  async getAdminByUsername(username) {
    const query = {
      text: "SELECT * FROM admin WHERE username = $1",
      values: [username],
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError("Admin not found");
    }

    return result.rows[0];
  }

  async getAdminAll() {
    const query = {
      text: "SELECT * FROM admin",
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError("Admin not found");
    }

    return result.rows;
  }

  async editAdminById(id, { username, password }) {
    const query = {
      text: "UPDATE admin SET username = $1, password = $2 WHERE id = $3",
      values: [username, password, id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Admin not found");
    }
  }

  async deleteAdminById(id) {
    const query = {
      text: "DELETE FROM admin WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Admin not found");
    }
  }
}

module.exports = AdminsService;
