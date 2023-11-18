
interface IError {
  code: number;
  message: string;
  exception?: any
}

/** Builds the error code adding the received exception to it */
export function hasException(err: IError, except?: any): IError {
  err.exception = (except !== undefined) ? except : null ;
  return err;
}

export const TRY_SEND_TRANSACTION_EXCEPTION = {
  code: 20101,
  message: "Trying to send the transaction raised an exception",
};

export const CREATE_ACCOUNT_WAITING_TIME_EXCEEDED = {
  code: 20102,
  message: "Waiting for account time exceeded !"
}

