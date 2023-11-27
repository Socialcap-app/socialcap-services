/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import { OffchainMerkleStorage } from "./dbs/index.js";
declare const fastify: import("fastify").FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault> & PromiseLike<import("fastify").FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>>;
declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library.js").DefaultArgs>;
declare const logger: import("fastify").FastifyBaseLogger;
declare const merkleStorage: typeof OffchainMerkleStorage;
export { fastify, logger, prisma, merkleStorage };
