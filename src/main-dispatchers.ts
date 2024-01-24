// import Fastify from 'fastify';
import 'dotenv/config';
import { Mina } from "o1js";
import { fastify, logger, merkleStorage } from "./global.js";
import fastifyJwt from "@fastify/jwt";
import cors from '@fastify/cors'

import {
  CreateClaimVotingAccountDispatcher,
  SendClaimVoteDispatcher
} from "./sequencer/dispatchers/index.js"

const AllDispatchers = new Map<string, any>;

function setupDispatchers(instances: any) {
  instances.forEach((instance: any) => {
    AllDispatchers.set(instance.name(), instance);
  })
}

// setup JWT plugin
fastify.register(fastifyJwt, { secret: "MYYYYsupersecret" });

// show all routes on server startup (just for debug)
fastify.post('/dispatch/:name', async (request, reply) => {
  const { name } = request.params as any;
  let { txData, sender } = request.body as any;

  let dispatcher = AllDispatchers.get(name);
  try {
    const response = await dispatcher.dispatch(txData, sender);
    reply.send(response);
  }
  catch (err) {
    reply.code(500).send(err)
  }
})

fastify.get('/max-retries/:name', async (request, reply) => {
  const { name } = request.params as any;
  
  let dispatcher = AllDispatchers.get(name);
  try {
    const response = await dispatcher.maxRetries();
    reply.send(response);
  }
  catch (err) {
    reply.code(500).send(err)
  }
})

fastify.post('/on-success/:name', async (request, reply) => {
  const { name } = request.params as any;
  let { txData, result } = request.body as any;

  let dispatcher = AllDispatchers.get(name);
  try {
    const response = await dispatcher.onSuccess(txData, result);
    reply.send(response);
  }
  catch (err) {
    reply.code(500).send(err)
  }
})

fastify.post('/on-failure/:name', async (request, reply) => {
  const { name } = request.params as any;
  let { txData, result } = request.body as any;

  let dispatcher = AllDispatchers.get(name);
  try {
    const response = await dispatcher.onFailure(txData, result);
    reply.send(response);
  }
  catch (err) {
    reply.code(500).send(err)
  }
})


// we dont allow CORS for now ...
// register CORS
// fastify.register(cors, {
//   origin: "*",
//   methods: ["POST", "GET"],
// });


/**
 * Setup and listen
 */
let args = process.argv.slice(2);
const port = Number(args[0]);

Mina.setActiveInstance(Mina.Network({
  mina: 'https://proxy.berkeley.minaexplorer.com/graphql', 
  archive: 'https://archive.berkeley.minaexplorer.com/'
}));

setupDispatchers([
  (new CreateClaimVotingAccountDispatcher()),
  (new SendClaimVoteDispatcher())
]);

fastify.listen({ port: port }, (err, address) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);

  // we need the Db to be ready before we can do this
  merkleStorage.startup();
});
