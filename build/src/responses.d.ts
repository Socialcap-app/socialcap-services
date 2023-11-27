import { hasError, raiseError, UNKNOWN_ERROR } from "./errors.js";
export { ResultOrError, hasResult, isResult, hasError, raiseError, isError, UNKNOWN_ERROR };
interface ResultOrError {
    data: any;
    error: any;
}
declare function hasResult(data: any): ResultOrError;
declare function isError(response: ResultOrError): boolean;
declare function isResult(response: ResultOrError): boolean;
