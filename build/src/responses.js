import { hasError, raiseError, UNKNOWN_ERROR } from "./errors.js";
export { hasResult, isResult, hasError, raiseError, isError, UNKNOWN_ERROR };
function hasResult(data) {
    return {
        data: data,
        error: null
    };
}
function isError(response) {
    return (response.error !== null && response.data === null);
}
function isResult(response) {
    return (response.error === null && response.data !== null);
}
//# sourceMappingURL=responses.js.map