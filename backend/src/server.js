// eslint-disable-next-line import/no-extraneous-dependencies
require("dotenv").config();

const Jwt = require("@hapi/jwt");
const path = require("path");
const Inert = require("@hapi/inert");

const Hapi = require("@hapi/hapi");
const users = require("./api/users");

const UsersService = require("./services/users/UsersService");
const UsersValidator = require("./validator/users");
const ClientError = require("./exceptions/ClientError");

const ItemsService = require("./services/items/ItemsService");
const ItemsValidator = require("./validator/items");

const VouchersService = require("./services/voucher/VoucherService");
const VoucherValidator = require("./validator/voucher");
const voucher = require("./api/voucher");

const order = require("./api/order");
const OrderService = require("./services/order/OrderService");
const OrderValidator = require("./validator/order");

const article = require("./api/article");
const ArticleService = require("./services/article/ArticleService");

const admin = require("./api/admin");
const AdminsService = require("./services/admin/AdminsService");

const authentications = require("./api/authentications");
const AuthenticationsServices = require("./services/auth/AuthenticationsServices");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");
const items = require("./api/items");


const init = async () => {
  const usersService = new UsersService();
  const itemsService = new ItemsService();
  const voucherService = new VouchersService();
  const orderService = new OrderService();
  const articleService = new ArticleService();
  const adminService = new AdminsService();
  const authenticationsServices = new AuthenticationsServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([Jwt, Inert]);

  server.auth.strategy("novamos_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: admin,
      options: {
        service: adminService,
      }
    },
    {
      plugin: article,
      options: {
        service: articleService,
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: items,
      options: {
        service: itemsService,
        validator: ItemsValidator,
      },
    },
    {
      plugin: voucher,
      options: {
        service: voucherService,
        validator: VoucherValidator,
      },
    },
    {
      plugin: order,
      options: {
        service: orderService
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsServices,
        service: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
