const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

class AuthenticationsServices {
    constructor() {
        this._pool =  pool;
    }

    async addRefreshToken(token) {
        const query = {
            text: "INSERT INTO authentications VALUES($1)",
            values: [token],
        };

        await this._pool.query(query);
    }

    async verifyRefreshToken(token) {
        const query = {
            text: "SELECT token FROM authentications WHERE token = $1",
            values: [token],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Refresh token tidak valid');
        }
    }

    async deleteRefreshToken(token) {
        const query = {
            text: "DELETE FROM authentications WHERE token = $1",
            values: [token],
        };

        await this._pool.query(query);
    }
}

module.exports = AuthenticationsServices;