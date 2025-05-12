/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class ItemsService {
  constructor() {
    this._pool = pool;
  }

  async postCategory({ name, image }) {
    const query = {
      text: "INSERT INTO category (name, image) VALUES ($1, $2) RETURNING id",
      values: [name, image],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getCategory() {
    const query = {
      text: "SELECT * FROM category",
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async putCategory(id, { name }) {
    const query = {
      text: "UPDATE category SET name = $1 WHERE id = $2",
      values: [name, id],
    };
    await this._pool.query(query);
  }

  async deleteCategory(id) {
    const query = {
      text: "DELETE FROM category WHERE id = $1",
      values: [id],
    };
    await this._pool.query(query);
  }

  async postItem({ title, description, price, images, category_id, weight }) {
      const query = {
        text: "INSERT INTO items (title, description, price, images, category_id, weight) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        values: [title, description, price, images, category_id, weight],
      };
      const result = await this._pool.query(query);
      return result.rows[0].id;
  }

  async getItems() {
    const query = {
      text: "SELECT * FROM items",
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async putItem(id, { title, description, price, category_id, weight }) {
    const query = {
      text: "UPDATE items SET title = $1, description = $2, price = $3, category_id = $4, weight = $5 WHERE id = $6",
      values: [title, description, price, category_id, weight, id],
    };
    await this._pool.query(query);
  }

  async deleteItem(id) {
    const query = {
      text: "DELETE FROM items WHERE id = $1",
      values: [id],
    };
    await this._pool.query(query);
  }
}

module.exports = ItemsService;