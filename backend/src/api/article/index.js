const ArticleHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'article',
  version: '1.0.0',
  register: async (server, { service }) => {
    const articleHandler = new ArticleHandler(service);
    server.route(routes(articleHandler));
  },
};