
export interface IError {
  code: number;
  message: string;
  exception?: object // MUST allways be an Object used by the caller
}

/** Builds the error code adding the received exception to it */
export function hasException(error: IError, except?: any): IError {
  error.exception = (except === undefined) ? {} : except;
  return error;
}

export const CREATE_ACCOUNT_WAITING_TIME_EXCEEDED = {
  code: 20102,
  message: "Waiting for account time exceeded !"
}

export const TRY_SEND_TRANSACTION_EXCEPTION = {
  code: 20201,
  message: "Trying to send the transaction raised an exception",
};

export const TRY_WAITING_TRANSACTION_EXCEPTION = {
  code: 20202,
  message: "Waiting for transaction exception"
};

export const TRANSACTION_WAITING_TIME_EXCEEDED = {
  code: 20203,
  message: "Waiting for transaction time exceeded !"
};

export const TRANSACTION_FAILED_EXCEPTION = {
  code: 20204,
  message: "The transaction failed and was was NOT added to a block.",
};

export const POST_TRANSACTION_EVENT_FAILED = {
  code: 20301,
  message: "Trying to post a transaction event failed"
};
