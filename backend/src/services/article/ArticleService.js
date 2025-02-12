/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class ArticlesService {
  constructor() {
    this._pool = pool;
  }

  async postArticle({ title, category, date, body, image }) {
    const query = {
      text: "INSERT INTO article (title, category, date, body, image) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      values: [title, category, date, body, image],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getArticles() {
    const query = {
      text: "SELECT * FROM article",
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getArticleById(id) {
    const query = {
      text: "SELECT * FROM article WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    // Check if the article exists
    if (result.rows.length === 0) {
      return null; // Return null if no article is found
    }

    return result.rows[0]; // Return the found article
  }

  async putArticle(id, { title, category, date, body, image }) {
    const query = {
      text: "UPDATE article SET title = $1, category = $2, date = $3, body = $4, image = $5 WHERE id = $6",
      values: [title, category, date, body, image, id],
    };
    await this._pool.query(query);
  }

  async deleteArticle(id) {
    const query = {
      text: "DELETE FROM article WHERE id = $1",
      values: [id],
    };
    await this._pool.query(query);
  }
}

module.exports = ArticlesService;