/**
 * This defines some Singleton instances used everywhere.
 * @MAZito - 2023-05-24 - initial
 */
import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { OffchainMerkleStorage } from "./dbs/index.js";

const fastify = Fastify({
  logger: true
})

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

const logger = fastify.log;

const merkleStorage = OffchainMerkleStorage ;

export {
  fastify, 
  logger, 
  prisma,
  merkleStorage
}
