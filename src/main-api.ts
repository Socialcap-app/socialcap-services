// import Fastify from 'fastify';
import { fastify, logger, merkleStorage } from "./global.js";
import fastifyJwt from "@fastify/jwt";
import fastifyRoutes from "@fastify/routes";
import cors from '@fastify/cors'
import helperRoutes from "./routes/helper-routes.js";
import queryRoutes from "./routes/query-routes.js";
import mutationRoutes from "./routes/mutation-routes.js";
import fileRoutes from "./routes/file-routes.js";

// setup JWT plugin
fastify.register(fastifyJwt, { secret: "MYYYYsupersecret" });

// show all routes on server startup (just for debug)
fastify.register(fastifyRoutes);

fastify
  .register(helperRoutes)
  .register(queryRoutes)
  .register(mutationRoutes)
  .register(fileRoutes);

// register CORS
fastify.register(cors, {
  origin: "*",
  methods: ["POST", "GET"],
});

/**
 * Setup and listen
 */
let args = process.argv.slice(2);
const PORT = Number(args[0] || '30080');

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
  logger.info(`Socialcap API listening at ${address}`);
  // console.log(fastify.routes);

  // we need the Db to be ready before we can do this
  merkleStorage.startup();
});
