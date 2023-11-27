/**
 * API result and error responses definitions and helpers
 * used to return a correct result or an error response.
 * @created - MAZito - 2023-0
 */
import { logger } from "./global.js";
import { hasError, raiseError, UNKNOWN_ERROR } from "./errors.js";

export { 
  ResultOrError,
  hasResult,
  isResult,
  hasError,
  raiseError,
  isError,
  UNKNOWN_ERROR
}

interface ResultOrError {
  data: any,
  error: any,
}

function hasResult(data: any): ResultOrError {
  return {
    data: data,
    error: null
  }
}

function isError(response: ResultOrError) {
  return (response.error !== null && response.data === null);
}

function isResult(response: ResultOrError) {
  return (response.error === null && response.data !== null);
}
