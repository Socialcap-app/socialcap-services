/**
 * Implement Mutation router
 */
import { FastifyInstance } from "fastify";
import { hasError, UNKNOWN_ERROR } from '../errors.js';
import { i18n as _ } from "../i18n/messages.js";
import { mutationHandlers } from '../controllers/index.js';

/**
 * A plugin that provide encapsulated routes 
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function mutationRoutes(
  fastify: FastifyInstance, 
  options: Object
) {
   fastify.post('/api/mutation/:method', async (request, reply) => {
    // get the RPC method from the Url path
    const method = (request.params as any).method;
    console.log("REQUEST BODY", request.body)
    // extract call "params" from POST payload
    const body = (request.body as any);
    let params = {}; 
    try { 
      params = body.params;
    }
    catch (err) { 
      params = {}; 
    }
  
    // check if requested 'method' is valid
    const handler = (mutationHandlers as any)[method];
    if (!handler) {
      return hasError.MethodNotSupported(
        _.method_not_supported(method)
      );
    }

    // check if we need to be authorized for callling this procedure
    const needsAuthorized = handler['authorize'];
    if (needsAuthorized) {
      fastify.log.info(`Handler ${method} needs authorization`)
    }

    // call the registered 'method' with given 'params'
    // $TODO: BEGIN Transaction here
    try {
      const callFn = handler['fn'];
      const response = await callFn(params, fastify);
      (response.error) 
        ? reply.code(response.error.code).send(response)
        : reply.send(response)
      // $TODO: COMMIT TRANSACTION or AUTOCOMMIT ? 
    }
    catch (err) {
      // $TODO: ROLLBACK TRANSACTION
      reply.code(UNKNOWN_ERROR).send(hasError.Unknown(
        _.unknown_error(method, `params=${JSON.stringify(params)} error=${err}`)
      ));
    }
  })
}

export default mutationRoutes;
