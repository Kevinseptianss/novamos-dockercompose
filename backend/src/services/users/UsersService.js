/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class UsersService {
  constructor() {
    this._pool = pool;
  }

  async addOTP({ otp, uniq }) {
    const query = {
      text: `INSERT INTO otp (code, uniq) VALUES ($1, $2) RETURNING id`,
      values: [otp, uniq],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async checkOTP({ otp, uniq }) {
    const query = {
      text: `SELECT * FROM otp WHERE code = $1 AND uniq = $2`,
      values: [otp, uniq],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteOTP(uniq) {
    const query = {
      text: `DELETE FROM otp WHERE uniq = $1`,
      values: [uniq],
    };
    await this._pool.query(query);
  }

  async addUser ({ name, email, phone }) {
    // Check if the email or phone already exists
    const checkQuery = {
        text: "SELECT id FROM users WHERE email = $1 OR phone = $2",
        values: [email, phone],
    };

    const checkResult = await this._pool.query(checkQuery);

    if (checkResult.rows.length > 0) {
        throw new InvariantError("Email or phone already exists");
    }

    // Proceed to insert the new user
    const query = {
        text: "INSERT INTO users (name, email, phone) VALUES($1, $2, $3) RETURNING id",
        values: [name, email, phone],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
        throw new InvariantError("User gagal ditambahkan");
    }

    return result.rows[0].id;
}

  async verifyUserCredential(otp, uniq, phone) {
    const result = await this.checkOTP({ otp, uniq });
    if (result) {
      const query = {
        text: "SELECT id, phone FROM users WHERE phone = $1",
        values: [phone],
      };

      try {
        const dbResult = await this._pool.query(query);
        const id = dbResult.rows[0]?.id;
        await this.deleteOTP(uniq);
        return id;
      } catch (error) {
        console.error("Database query error:", error);
        throw new Error("Database query failed");
      }
    } else {
      throw new InvariantError("Kredensial yang anda berikan salah");
    }
  }

  async getUser(id) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getUserAdmin() {
    const query = {
      text: "SELECT * FROM users"
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = UsersService;
