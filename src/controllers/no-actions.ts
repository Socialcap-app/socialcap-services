import { hasResult } from "../responses.js";

/**
 * Call with no actions, just for testing purposes.
 * @param params Object
 * @returns MutationResult
 */
export async function noActions(params: Object) { 
  return hasResult({});
}
