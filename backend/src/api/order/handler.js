const path = require('path'); // Import path module for handling file paths
const fs = require("fs");
/* eslint-disable no-underscore-dangle */
class OrdersHandler {
  constructor(service) {
    this._service = service;

    this.getOrder = this.getOrder.bind(this);
    this.getOrderAdmin = this.getOrderAdmin.bind(this);
    this.getOrderById = this.getOrderById.bind(this);
    this.postOrder = this.postOrder.bind(this);
    this.putOrder = this.putOrder.bind(this);
    this.putOrderAWB = this.putOrderAWB.bind(this);
    this.putOrderStatus = this.putOrderStatus.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.uploadOrder = this.uploadOrder.bind(this);
  }

  async uploadOrder(request, h) {
      try {
        const { id, payment, status } = request.payload;
        const image = request.payload.image; // Get the uploaded file
    
        // Ensure the uploads directory exists
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir);
        }
    
        // Generate a random filename for the uploaded image
        const randomFilename = generateRandomString() + path.extname(image.hapi.filename);
        const writeStream = fs.createWriteStream(path.join(uploadsDir, randomFilename));
        
        // Write the image data to the file
        writeStream.write(image._data);
        writeStream.end();
    
        const imageid = await this._service.postUploadOrder({
          id,
          payment,
          status,
          image: randomFilename, // Save the new random filename of the uploaded image
        });
    
        return h
          .response({
            status: "success",
            data: {
              imageid,
            },
          })
          .code(201);
      } catch (error) {
        return h
          .response({
            status: "failllll",
            message: error.message,
          })
          .code(400);
      }
    }

  async getOrder(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const order = await this._service.getOrder(credentialId);

    if (!order) {
      return h.response({ error: 'Order not found' }).code(404);
    }

    return h.response(order).code(200);
  }

  async getOrderAdmin(request, h) {
    const order = await this._service.getOrderAdmin();

    if (!order) {
      return h.response({ error: 'Order not found' }).code(404);
    }

    return h.response(order).code(200);
  }

  async getOrderById(request, h) {
    const { id } = request.params; // Get order ID from request parameters
    const order = await this._service.getOrderById(id); // Fetch order by ID

    if (!order) {
      return h.response({ error: 'Order not found' }).code(404);
    }

    return h.response(order).code(200); // Return the order details
  }

  async postOrder(request, h) {
    const orderId = await this._service.postOrder(request.payload); // Add new order
    console.log(request.payload);
    return h.response({ id: orderId }).code(201); // Return the ID of the created order
  }

  async putOrder(request, h) {
    const { id } = request.params; // Get order ID from request parameters

    const updated = await this._service.updateOrder(id, request.payload); // Update the order

    if (!updated) {
      return h.response({ error: 'Order not found' }).code(404);
    }

    return h.response({ message: 'Order updated successfully' }).code(200); // Return success message
  }

  async putOrderAWB(request, h) {
    const { id } = request.params; // Get order ID from request parameters

    const updated = await this._service.updateOrderAWB(id, request.payload); // Update the order

    if (!updated) {
      return h.response({ error: 'Order not found' }).code(404);
    }

    return h.response({ message: 'Order updated successfully' }).code(200); // Return success message
  }

  async putOrderStatus(request, h) {
    const { id } = request.params; // Get order ID from request parameters

    const updated = await this._service.updateOrderStatus(id, request.payload); // Update the order

    if (!updated) {
      return h.response({ error: 'Order not found' }).code(404);
    }

    return h.response({ message: 'Order updated successfully' }).code(200); // Return success message
  }

  async deleteOrder(request, h) {
    const { id } = request.params; // Get order ID from request parameters
    const deleted = await this._service.deleteOrder(id); // Delete the order

    if (!deleted) {
      return h.response({ error: 'Order not found' }).code(404);
    }

    return h.response({ message: 'Order deleted successfully' }).code(200); // Return success message
  }
}

const generateRandomString = (length = 16) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

module.exports = OrdersHandler;