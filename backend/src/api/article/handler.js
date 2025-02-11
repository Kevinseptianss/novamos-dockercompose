const path = require('path'); // Import path module for handling file paths
const fs = require("fs");
/* eslint-disable no-underscore-dangle */
class ArticlesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getArticles = this.getArticles.bind(this);
    this.getArticleById = this.getArticleById.bind(this); // Bind the new method
    this.postArticle = this.postArticle.bind(this);
    this.putArticle = this.putArticle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
  }

  async getArticles(request, h) {
    try {
      const articles = await this._service.getArticles();
      return h
        .response({
          status: "success",
          data: {
            articles,
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

  async getArticleById(request, h) {
    try {
      const { id } = request.params; // Get the article ID from the request parameters
      const article = await this._service.getArticleById(id); // Fetch the article from the service

      if (!article) {
        return h
          .response({
            status: "fail",
            message: "Article not found",
          })
          .code(404);
      }

      return h
        .response({
          status: "success",
          data: {
            article,
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

  async postArticle(request, h) {
    let imagePath; // Declare imagePath outside the try block

    try {
      const { title, category, date, body } = request.payload;
      const image = request.payload.image; // Get the uploaded file

      if (!image) {
        throw new Error("Image is required");
      }

      // Ensure the uploads directory exists
      const uploadsDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

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

      imagePath = randomFileName; // Save the new filename

      const articleId = await this._service.postArticle({
        title,
        category,
        date,
        body,
        image: imagePath, // Save the image filename
      });

      return h
        .response({
          status: "success",
          data: {
            articleId,
          },
        })
        .code(201);
    } catch (error) {
      // Rollback: Delete the uploaded image if an error occurs
      if (imagePath) {
        const filePath = path.join(__dirname, 'uploads', imagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Delete the file
        }
      }

      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(400);
    }
  }

  async putArticle(request, h) {
    try {
      const { id } = request.params;
      await this._service.putArticle(id, request.payload);
      return h
        .response({
          status: "success",
          message: "Article updated successfully",
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

  async deleteArticle(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteArticle(id);
      return h
        .response({
          status: "success",
          message: "Article deleted successfully",
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

const generateRandomString = (length = 16 ) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

module.exports = ArticlesHandler;