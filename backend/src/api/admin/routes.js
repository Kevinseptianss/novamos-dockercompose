const routes = (handler) => [
  {
    method: "POST",
    path: "/admins",
    handler: handler.postAdmin,
  },
  {
    method: "POST",
    path: "/admins/login",
    handler: handler.postAdminLogin,
  },
  {
    method: "POST",
    path: "/admins/forgot",
    handler: handler.postAdminForgot,
  },
  {
    method: "GET",
    path: "/adminsall",
    handler: handler.getAdminAll,
  },
  {
    method: "GET",
    path: "/admins/{adminId}",
    handler: handler.getAdmin,
  },
  {
    method: "GET",
    path: "/admins/username/{username}",
    handler: handler.getAdminByUsername,
  },
  {
    method: "PUT",
    path: "/admins/{adminId}",
    handler: handler.putAdmin,
  },
  {
    method: "DELETE",
    path: "/admins/{adminId}",
    handler: handler.deleteAdmin,
  },
];

module.exports = routes;