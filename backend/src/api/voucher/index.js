const VoucherHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'voucher',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const voucherHandler = new VoucherHandler(service, validator);
    server.route(routes(voucherHandler));
  },
};