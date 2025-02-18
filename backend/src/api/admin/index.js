const AdminHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'admin',
  version: '1.0.0',
  register: async (server, { service }) => {
    const adminHandler = new AdminHandler(service);
    server.route(routes(adminHandler));
  },
};
