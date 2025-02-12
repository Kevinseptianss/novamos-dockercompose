/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class OrderService {
  constructor() {
    this._pool = pool; // Initialize the PostgreSQL connection pool
  }

  // Method to create a new order
  async postOrder(orderData) {
    try {
      const { id, user, order_date, items, voucher, payment, address, courier, status, user_id } = orderData;
      const userJson = user ? JSON.stringify(user) : "";
      const itemsJson = items ? JSON.stringify(items) : "";
      const voucherJson = voucher ? JSON.stringify(voucher) : "";
      const paymentJson = payment ? JSON.stringify(payment) : "";
      const addressJson = address ? JSON.stringify(address) : "";
      const courierJson = courier ? JSON.stringify(courier) : "";
      const statusJson = status ? JSON.stringify(status) : "";
      const result = await this._pool.query(
        'INSERT INTO "order" (id, "user", order_date, items, voucher, payment, address, courier, status, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
        [id, userJson, order_date, itemsJson, voucherJson, paymentJson, addressJson, courierJson, statusJson, user_id]
      );
      return { status: 'success', id: result.rows[0].id }; // Return the ID of the newly created order with status
    } catch (error) {
      console.error(error);
      return { status: 'error', message: 'Error creating order' }; // Return error status
    }
  }

  async postUploadOrder({ id, payment, status, image }) {
    const updatePayment = {
      payment: payment,
      status: status,
      image: image,
    }
    const query = {
      text: `UPDATE "order" SET payment = $1 WHERE id = $2`,
      values: [updatePayment, id],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  // Method to retrieve all orders
  async getOrder(id) {
    try {
      const result = await this._pool.query('SELECT * FROM "order" WHERE user_id = $1', [id]);
      return { status: 'success', orders: result.rows }; // Return all orders with status
    } catch (error) {
      console.error(error);
      return { status: 'error', message: 'Error retrieving orders' }; // Return error status
    }
  }

  async getOrderAdmin() {
    try {
      const result = await this._pool.query('SELECT * FROM "order"');
      return { status: 'success', orders: result.rows }; // Return all orders with status
    } catch (error) {
      console.error(error);
      return { status: 'error', message: 'Error retrieving orders' }; // Return error status
    }
  }

  // Method to retrieve an order by ID
  async getOrderById(orderData) {
    try {
      const result = await this._pool.query('SELECT * FROM "order" WHERE id = $1', [orderData]);
      if (result.rows.length > 0) {
        return { status: 'success', order: result.rows[0] }; // Return the order with status
      } else {
        return { status: 'error', message: 'Order not found' }; // Return error if order not found
      }
    } catch (error) {
      console.error(error);
      return { status: 'error', message: 'Error retrieving order' }; // Return error status
    }
  }

  // Method to update an existing order
  async updateOrder(id, orderData) {
    const { user, order_date, items, voucher, payment, address, courier } = orderData; // Adjusted to match postOrder structure
    try {
      const result = await this._pool.query(
        'UPDATE "order" SET "user" = $1, order_date = $2, items = $3, voucher = $4, payment = $5, address = $6, courier = $7 WHERE id = $8',
        [user, order_date, items, voucher, payment, address, courier, id]
      );
      if (result.rowCount > 0) {
        return { status: 'success', message: 'Order updated successfully' }; // Return success status
      } else {
        return { status: 'error', message: 'Order not found' }; // Return error if order not found
      }
    } catch (error) {
      console.error(error);
      return { status: 'error', message: 'Error updating order' }; // Return error status
    }
  }

  async updateOrderAWB(id, orderData) {
    const awb = JSON.stringify(orderData); // Adjusted to match postOrder structure
    try {
      const result = await this._pool.query(
        'UPDATE "order" SET courier = $1 WHERE id = $2',
        [awb, id]
      );
      if (result.rowCount > 0) {
        return { status: 'success', message: 'Order updated successfully' }; // Return success status
      } else {
        return { status: 'error', message: 'Order not found' }; // Return error if order not found
      }
    } catch (error) {
      console.error(error);
      return { status: 'error', message: 'Error updating order' }; // Return error status
    }
  }

  async updateOrderStatus(id, orderData) {
    const status = JSON.stringify(orderData); // Adjusted to match postOrder structure
    try {
      const result = await this._pool.query(
        'UPDATE "order" SET status = $1 WHERE id = $2',
        [status, id]
      );
      if (result.rowCount > 0) {
        return { status: 'success', message: 'Order updated successfully' }; // Return success status
      } else {
        return { status: 'error', message: 'Order not found' }; // Return error if order not found
      }
    } catch (error) {
      console.error(error);
      return { status: 'error', message: 'Error updating order' }; // Return error status
    }
  }

  // Method to delete an order by ID
  async deleteOrder(orderData) {
    const { id } = orderData; // Extract id from orderData
    try {
      const result = await this._pool.query('DELETE FROM "order" WHERE id = $1', [id]);
      if (result.rowCount > 0) {
        return { status: 'success', message: 'Order deleted successfully' }; // Return success status
      } else {
        return { status: 'error', message: 'Order not found' }; // Return error if order not found
      }
    } catch (error) {
      console.error(error);
      return { status: 'error', message: 'Error deleting order' }; // Return error status
    }
  }
}

module.exports = OrderService;