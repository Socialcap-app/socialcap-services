/**
 * Implement Query router
 */
import { FastifyInstance } from "fastify";
/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
declare function queryRoutes(fastify: FastifyInstance, options: Object): Promise<void>;
export default queryRoutes;
