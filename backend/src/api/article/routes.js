const path = require('path'); 

const routes = (handler) => [
  // Article Routes
  {
    method: "GET",
    path: "/articles",
    handler: handler.getArticles,
  },
  {
    method: "POST",
    path: "/articles",
    handler: handler.postArticle,
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
    path: "/articles/upload/{filename}",
    handler: {
      directory: {
        path: path.join(__dirname, 'uploads'), // Path to the uploads directory
        redirectToSlash: true,
        index: false, // Disable directory listing
      },
    },
  },
  {
    method: "GET", // New route for getting an article by ID
    path: "/articles/{id}",
    handler: handler.getArticleById, // Handler function to get article by ID
  },
  {
    method: "PUT",
    path: "/articles/{id}",
    handler: handler.putArticle,
  },
  {
    method: "DELETE",
    path: "/articles/{id}",
    handler: handler.deleteArticle,
  },
];

module.exports = routes;