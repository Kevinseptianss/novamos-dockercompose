const ItemsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'items',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const itemHandler = new ItemsHandler(service, validator);
    server.route(routes(itemHandler));
  },
};