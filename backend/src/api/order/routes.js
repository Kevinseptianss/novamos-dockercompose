const path = require('path'); 
const routes = (handler) => [
  {
    method: "GET",
    path: "/orders",
    handler: handler.getOrder,
    options: {
      auth: "novamos_jwt",
    },
  },
  {
    method: "GET",
    path: "/ordersadmin",
    handler: handler.getOrderAdmin,
  },
  {
    method: "POST",
    path: "/orders/upload",
    handler: handler.uploadOrder,
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
      path: "/orders/upload/{filename}",
      handler: {
        directory: {
          path: path.join(__dirname, 'uploads'), // Path to the uploads directory
          redirectToSlash: true,
          index: false, // Disable directory listing
        },
      },
    },
  {
    method: "GET",
    path: "/orders/{id}", // Route to get a specific order by ID
    handler: handler.getOrderById,
  },
  {
    method: "POST",
    path: "/orders", // Route to create a new order
    handler: handler.postOrder,
  },
  {
    method: "PUT",
    path: "/orders/{id}", // Route to update a specific order by ID
    handler: handler.putOrder,
  },
  {
    method: "PUT",
    path: "/ordersawb/{id}", // Route to update a specific order by ID
    handler: handler.putOrderAWB,
  },
  {
    method: "PUT",
    path: "/ordersstatus/{id}", // Route to update a specific order by ID
    handler: handler.putOrderStatus,
  },
  {
    method: "DELETE",
    path: "/orders/{id}", // Route to delete a specific order by ID
    handler: handler.deleteOrder,
  },
];

module.exports = routes;
