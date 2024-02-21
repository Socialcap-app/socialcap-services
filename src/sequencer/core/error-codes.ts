import { UNRESOLVED } from "./transaction-queues";

export interface IError {
  code: number;
  message: string;
  exception?: object // MUST allways be an Object used by the caller
}

// These play a role similar to HTTP Errors, and categorize the more
// specific errors 
export const 
  NOT_FOUND = 404,
  UNRESOLVED_ERROR = 500, // Internal server error
  WORKER_ERROR = 502; // Bad gateway

/** Builds the error code adding the received exception to it */
export function hasException(error: IError, except?: any): IError {
  error.exception = (except === undefined) ? {} : except;
  return error;
}

export const WORKER_UNAVAILABLE = {
  code: WORKER_ERROR,
  message: "The required worker is not available.",
}

export const CREATE_ACCOUNT_WAITING_TIME_EXCEEDED = {
  code: UNRESOLVED_ERROR,
  message: "Waiting for account time exceeded !"
}

export const NO_FEE_PAYER_AVAILABLE = {
  code: UNRESOLVED_ERROR,
  message: "There is no fee payer with this account publicKey.",
}

export const ACCOUNT_NOT_FOUND = {
  code: UNRESOLVED_ERROR,
  message: "The account has not been found in the MINA network.",
}

export const PREPARE_TRANSACTION_FAILED = {
  code: UNRESOLVED_ERROR,
  message: "Trying to prepare the transaction failed. This is an irrecoverable error.",
}

export const PROVING_TRANSACTION_FAILED = {
  code: 20202,
  message: "Trying to prove the transaction failed. This is an irrecoverable error.",
}


export const TRY_SEND_TRANSACTION_EXCEPTION = {
  code: 20203,
  message: "Trying to send the transaction raised an exception",
};

export const TRY_WAITING_TRANSACTION_EXCEPTION = {
  code: 20204,
  message: "Waiting for transaction exception"
};

export const TRANSACTION_WAITING_TIME_EXCEEDED = {
  code: 20205,
  message: "Waiting for transaction time exceeded !"
};

export const TRANSACTION_FAILED_EXCEPTION = {
  code: 20206,
  message: "The transaction failed and was was NOT added to a block.",
};

export const POST_TRANSACTION_EVENT_FAILED = {
  code: 20301,
  message: "Trying to post a transaction event failed"
};
