const OrderHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'order',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const orderHandler = new OrderHandler(service, validator);
    server.route(routes(orderHandler));
  },
};
