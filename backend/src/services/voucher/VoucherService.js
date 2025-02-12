/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class VouchersService {
  constructor() {
    this._pool = pool;
  }

  async getVouchers() {
    const result = await this._pool.query('SELECT * FROM voucher');
    return result.rows; // Return all vouchers
  }

  async addVoucher({ name, description, expired, value, type, min, image }) {
    const result = await this._pool.query(
      'INSERT INTO voucher (name, description, expired, value, type, min, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [name, description, expired, value, type, min, image]
    );

    if (!result.rows.length) {
      throw new InvariantError('Voucher could not be added');
    }

    return result.rows[0].id; // Return the ID of the newly created voucher
  }

  async updateVoucher(id, { name, description, expired, value, type, min }) {
    const result = await this._pool.query(
      'UPDATE voucher SET name = $1, description = $2, expired = $3, value = $4, type = $5, min = $6 WHERE id = $7',
      [name, description, expired, value, type, min, id]
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Voucher not found');
    }
  }

  async deleteVoucher(id) {
    const result = await this._pool.query('DELETE FROM voucher WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      throw new NotFoundError('Voucher not found');
    }
  }
}

module.exports = VouchersService;