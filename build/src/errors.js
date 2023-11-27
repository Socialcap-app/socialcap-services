import { logger } from "./global.js";
const UNKNOWN_ERROR = 500
// **What are you talking about?**
, PARSE_ERROR = 400, BAD_REQUEST = 400, NOT_FOUND = 404, METHOD_NOT_SUPPORTED = 405, CONFLICT = 409, PRECONDITION_FAILED = 412, PAYLOAD_TOO_LARGE = 413
// **Who are you? Not for you ...**
, UNAUTHORIZED = 401, FORBIDDEN = 403
// **Uppps ! I have shamely failed ...** 
, TIMEOUT = 408, INTERNAL_SERVER_ERROR = 500, BAD_GATEWAY = 503;
function formatError(code, message) {
    // All errors are logged to the Fastify.logger
    logger.error(`Error ${code}: ${message}`);
    return {
        data: null,
        error: {
            code: code,
            message: (message || '').toString()
        }
    };
}
function formatAndRaiseError(code, message) {
    const m = `Raised error '${code}': ${message}`;
    logger.error(m);
    throw new Error(m);
}
;
const hasError = {
    Unknown: (m) => formatError(UNKNOWN_ERROR, m),
    Parse: (m) => formatError(PARSE_ERROR, m),
    BadRequest: (m) => formatError(BAD_REQUEST, m),
    MissingParams: (m) => formatError(BAD_REQUEST, m),
    NotFound: (m) => formatError(NOT_FOUND, m),
    MethodNotSupported: (m) => formatError(METHOD_NOT_SUPPORTED, m),
    Conflict: (m) => formatError(CONFLICT, m),
    PreconditionFailed: (m) => formatError(PRECONDITION_FAILED, m),
    PayloadTooLarge: (m) => formatError(PAYLOAD_TOO_LARGE, m),
    UnauthorizedError: (m) => formatError(UNAUTHORIZED, m),
    ForbiddenError: (m) => formatError(FORBIDDEN, m),
    Timeout: (m) => formatError(TIMEOUT, m),
    InternalServer: (m) => formatError(INTERNAL_SERVER_ERROR, m),
    DatabaseEngine: (m) => formatError(BAD_GATEWAY, m),
    This: (err) => formatError(err.code, err.message),
};
const raiseError = {
    Unknown: (m) => formatAndRaiseError(UNKNOWN_ERROR, m),
    Parse: (m) => formatAndRaiseError(PARSE_ERROR, m),
    BadRequest: (m) => formatAndRaiseError(BAD_REQUEST, m),
    MissingParams: (m) => formatAndRaiseError(BAD_REQUEST, m),
    NotFound: (m) => formatAndRaiseError(NOT_FOUND, m),
    MethodNotSupported: (m) => formatAndRaiseError(METHOD_NOT_SUPPORTED, m),
    Conflict: (m) => formatAndRaiseError(CONFLICT, m),
    PreconditionFailed: (m) => formatAndRaiseError(PRECONDITION_FAILED, m),
    PayloadTooLarge: (m) => formatAndRaiseError(PAYLOAD_TOO_LARGE, m),
    UnauthorizedError: (m) => formatAndRaiseError(UNAUTHORIZED, m),
    ForbiddenError: (m) => formatAndRaiseError(FORBIDDEN, m),
    Timeout: (m) => formatAndRaiseError(TIMEOUT, m),
    InternalServer: (m) => formatAndRaiseError(INTERNAL_SERVER_ERROR, m),
    DatabaseEngine: (m) => formatAndRaiseError(BAD_GATEWAY, m),
    This: (err) => formatAndRaiseError(err.code, err.message),
};
export { UNKNOWN_ERROR, hasError, raiseError };
//# sourceMappingURL=errors.js.map