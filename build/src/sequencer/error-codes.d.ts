export interface IError {
    code: number;
    message: string;
    exception?: object;
}
/** Builds the error code adding the received exception to it */
export declare function hasException(error: IError, except?: any): IError;
export declare const CREATE_ACCOUNT_WAITING_TIME_EXCEEDED: {
    code: number;
    message: string;
};
export declare const TRY_SEND_TRANSACTION_EXCEPTION: {
    code: number;
    message: string;
};
export declare const TRY_WAITING_TRANSACTION_EXCEPTION: {
    code: number;
    message: string;
};
export declare const TRANSACTION_WAITING_TIME_EXCEEDED: {
    code: number;
    message: string;
};
export declare const TRANSACTION_FAILED_EXCEPTION: {
    code: number;
    message: string;
};
export declare const POST_TRANSACTION_EVENT_FAILED: {
    code: number;
    message: string;
};
