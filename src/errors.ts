import { logger } from "./global.js";

const
  UNKNOWN_ERROR = 500

  // **What are you talking about?**
  , PARSE_ERROR = 400
  , BAD_REQUEST = 400
  , NOT_FOUND = 404
  , METHOD_NOT_SUPPORTED = 405
  , CONFLICT = 409
  , PRECONDITION_FAILED = 412
  , PAYLOAD_TOO_LARGE = 413

  // **Who are you? Not for you ...**
   , UNAUTHORIZED = 401
  , FORBIDDEN = 403

  // **Uppps ! I have shamely failed ...** 
  , TIMEOUT = 408
  , INTERNAL_SERVER_ERROR = 500
  , BAD_GATEWAY = 503
;

function formatError(code: number, message: string) {
  // All errors are logged to the Fastify.logger
  logger.error(`Error ${code}: ${message}`);
  return {
    data: null,
    error: {
      code: code, 
      message: (message || '').toString()
    }
  }
}

function formatAndRaiseError(code: number, message: string) { 
  const m = `Raised error '${code}': ${message}`;
  logger.error(m);
  throw new Error(m) 
};


const hasError = { 
  Unknown: (m: string) =>  formatError(UNKNOWN_ERROR, m)
  , Parse: (m: string) =>  formatError(PARSE_ERROR, m)
  , BadRequest: (m: string) =>  formatError(BAD_REQUEST, m)
  , MissingParams: (m: string) =>  formatError(BAD_REQUEST, m)
  , NotFound: (m: string) =>  formatError(NOT_FOUND, m)
  , MethodNotSupported: (m: string) =>  formatError(METHOD_NOT_SUPPORTED, m)
  , Conflict: (m: string) =>  formatError(CONFLICT, m)
  , PreconditionFailed: (m: string) =>  formatError(PRECONDITION_FAILED, m)
  , PayloadTooLarge: (m: string) =>  formatError(PAYLOAD_TOO_LARGE, m)
  , UnauthorizedError : (m: string) =>  formatError(UNAUTHORIZED, m)
  , ForbiddenError : (m: string) =>  formatError(FORBIDDEN, m)
  , Timeout: (m: string) =>  formatError(TIMEOUT, m)
  , InternalServer: (m: string) =>  formatError(INTERNAL_SERVER_ERROR, m)
  , DatabaseEngine: (m: string) =>  formatError(BAD_GATEWAY, m)
  , This: (err: {code: number, message: string}) => formatError(err.code, err.message),
}

const raiseError = { 
  Unknown: (m: string) =>  formatAndRaiseError(UNKNOWN_ERROR, m)
  , Parse: (m: string) =>  formatAndRaiseError(PARSE_ERROR, m)
  , BadRequest: (m: string) =>  formatAndRaiseError(BAD_REQUEST, m)
  , MissingParams: (m: string) =>  formatAndRaiseError(BAD_REQUEST, m)
  , NotFound: (m: string) =>  formatAndRaiseError(NOT_FOUND, m)
  , MethodNotSupported: (m: string) =>  formatAndRaiseError(METHOD_NOT_SUPPORTED, m)
  , Conflict: (m: string) =>  formatAndRaiseError(CONFLICT, m)
  , PreconditionFailed: (m: string) =>  formatAndRaiseError(PRECONDITION_FAILED, m)
  , PayloadTooLarge: (m: string) =>  formatAndRaiseError(PAYLOAD_TOO_LARGE, m)
  , UnauthorizedError : (m: string) =>  formatAndRaiseError(UNAUTHORIZED, m)
  , ForbiddenError : (m: string) =>  formatAndRaiseError(FORBIDDEN, m)
  , Timeout: (m: string) =>  formatAndRaiseError(TIMEOUT, m)
  , InternalServer: (m: string) =>  formatAndRaiseError(INTERNAL_SERVER_ERROR, m)
  , DatabaseEngine: (m: string) =>  formatAndRaiseError(BAD_GATEWAY, m)
  , This: (err: {code: number, message: string}) => formatAndRaiseError(err.code, err.message),
}


export {
  UNKNOWN_ERROR,
  hasError,
  raiseError
};
