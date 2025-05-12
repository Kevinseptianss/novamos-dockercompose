const path = require('path'); // Import path module for handling file paths
const fs = require("fs");
/* eslint-disable no-underscore-dangle */
class ItemsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getItems = this.getItems.bind(this);
    this.postItem = this.postItem.bind(this);
    this.putItem = this.putItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.postCategory = this.postCategory.bind(this);
    this.putCategory = this.putCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  async getItems(request, h) {
    try {
      const items = await this._service.getItems();
      return h
        .response({
          status: "success",
          data: {
            items,
          },
        })
        .code(200);
    } catch (error) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(500);
    }
  }

  

  async postItem(request, h) {
    let imagePaths = []; // Declare imagePaths outside the try block
    try {
      this._validator.validateItemPayload(request.payload);
      const { title, description, price, category_id, weight } = request.payload;
      const images = request.payload.images; // Get the uploaded files
  
      if (!Array.isArray(images)) {
        throw new Error("Images must be an array");
      }
  
      // Ensure the uploads directory exists
      const uploadsDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
  
      for (const image of images) {
        // Generate a random filename while preserving the original file extension
        const originalExtension = path.extname(image.hapi.filename); // Get the original file extension
        const randomFileName = `${generateRandomString()}${originalExtension}`; // Generate a random filename with the original extension
  
        const writeStream = fs.createWriteStream(path.join(uploadsDir, randomFileName));
        writeStream.write(image._data);
        writeStream.end();
  
        // Wait for the write stream to finish
        await new Promise((resolve, reject) => {
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });
  
        imagePaths.push(randomFileName); // Add the new filename to the imagePaths array
      }
  
      const itemId = await this._service.postItem({
        title,
        description,
        price,
        images: JSON.stringify(imagePaths), // Save the array of image filenames as a JSON string
        category_id,
        weight
      });
  
      return h
        .response({
          status: "success",
          data: {
            itemId,
          },
        })
        .code(201);
    } catch (error) {
      // Rollback: Delete any uploaded images if an error occurs
      if (imagePaths.length > 0) {
        for (const imagePath of imagePaths) {
          const filePath = path.join(__dirname, 'uploads', imagePath);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete the file
          }
        }
      }
  
      return h
        .response({
          status: "fail test",
          message: error.message,
        })
        .code(400);
    }
  }

  async putItem(request, h) {
    try {
      const { id } = request.params;
      await this._service.putItem(id, request.payload);
      return h
        .response({
          status: "success",
          message: "Item updated successfully",
        })
        .code(200);
    } catch (error) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(400);
    }
  }

  async deleteItem(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteItem(id);
      return h
        .response({
          status: "success",
          message: "Item deleted successfully",
        })
        .code(200);
    } catch (error) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(400);
    }
  }

  async getCategory(request, h) {
    try {
      const categories = await this._service.getCategory();
      return h
        .response({
          status: "success",
          data: {
            categories,
          },
        })
        .code(200);
    } catch (error) {
      return h
        .response({
          status: " fail",
          message: error.message,
        })
        .code(500);
    }
  }

  async postCategory(request, h) {
    try {
      this._validator.validateCategoryPayload(request.payload);
      const { name } = request.payload;
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
  
      const categoryId = await this._service.postCategory({
        name,
        image: randomFilename, // Save the new random filename of the uploaded image
      });
  
      return h
        .response({
          status: "success",
          data: {
            categoryId,
          },
        })
        .code(201);
    } catch (error) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(400);
    }
  }

  async putCategory(request, h) {
    try {
      const { id } = request.params;
      await this._service.putCategory(id, request.payload);
      return h
        .response({
          status: "success",
          message: "Category updated successfully",
        })
        .code(200);
    } catch (error) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(400);
    }
  }

  async deleteCategory(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteCategory(id);
      return h
        .response({
          status: "success",
          message: "Category deleted successfully",
        })
        .code(200);
    } catch (error) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(400);
    }
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

module.exports = ItemsHandler;
