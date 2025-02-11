const path = require('path'); 
const routes = (handler) => [
  // Item Routes
  {
    method: "GET",
    path: "/items",
    handler: handler.getItems,
  },
  {
    method: "POST",
    path: "/items",
    handler: handler.postItem,
    options: {
      payload: {
        maxBytes: 10485760,
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
  {
    method: "GET",
    path: "/items/upload/{filename}",
    handler: {
      directory: {
        path: path.join(__dirname, 'uploads'), // Path to the uploads directory
        redirectToSlash: true,
        index: false, // Disable directory listing
      },
    },
  },
  {
    method: "PUT",
    path: "/items/{id}",
    handler: handler.putItem,
  },
  {
    method: "DELETE",
    path: "/items/{id}",
    handler: handler.deleteItem,
  },

  // Category Routes
  {
    method: "GET",
    path: "/categories",
    handler: handler.getCategory,
  },
  {
    method: "POST",
    path: "/categories",
    handler: handler.postCategory,
    options: {
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
  {
    method: "PUT",
    path: "/categories/{id}",
    handler: handler.putCategory,
  },
  {
    method: "DELETE",
    path: "/categories/{id}",
    handler: handler.deleteCategory,
  },
];

module.exports = routes;
