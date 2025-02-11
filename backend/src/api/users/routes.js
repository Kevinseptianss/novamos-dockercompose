const routes = (handler) => [
  {
    method: 'POST',
    path: '/users/getotp',
    handler: handler.postOtp,
  },
  {
    method: 'POST',
    path: '/users/register',
    handler: handler.postUser,
  },
  {
    method: 'GET',
    path: '/users/info',
    handler: handler.getUser,
    options: {
      auth: 'novamos_jwt',
  },
  }
];

module.exports = routes;
