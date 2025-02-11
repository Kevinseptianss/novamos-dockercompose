const path = require('path'); 
const routes = (handler) => [
  {
    method: "GET",
    path: "/vouchers",
    handler: handler.getVoucher, // Assuming this method fetches all vouchers
  },
  {
    method: "POST",
    path: "/vouchers",
    options: {
      payload: {
        maxBytes: 10485760,
        output: "stream",
        parse: true,
        allow: "multipart/form-data", // Allow file uploads
        multipart: true,
      },
    },
    handler: handler.postVoucher, // Assuming this method creates a new voucher
  },
  {
    method: "GET",
    path: "/vouchers/upload/{filename}",
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
    path: "/vouchers/{id}",
    handler: handler.putVoucher, // Assuming this method updates an existing voucher
  },
  {
    method: "DELETE",
    path: "/vouchers/{id}",
    handler: handler.deleteVoucher, // Assuming this method deletes a voucher
  },
];

module.exports = routes;
