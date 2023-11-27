declare const UNKNOWN_ERROR = 500;
declare const hasError: {
    Unknown: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    Parse: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    BadRequest: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    MissingParams: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    NotFound: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    MethodNotSupported: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    Conflict: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    PreconditionFailed: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    PayloadTooLarge: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    UnauthorizedError: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    ForbiddenError: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    Timeout: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    InternalServer: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    DatabaseEngine: (m: string) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
    This: (err: {
        code: number;
        message: string;
    }) => {
        data: null;
        error: {
            code: number;
            message: string;
        };
    };
};
declare const raiseError: {
    Unknown: (m: string) => void;
    Parse: (m: string) => void;
    BadRequest: (m: string) => void;
    MissingParams: (m: string) => void;
    NotFound: (m: string) => void;
    MethodNotSupported: (m: string) => void;
    Conflict: (m: string) => void;
    PreconditionFailed: (m: string) => void;
    PayloadTooLarge: (m: string) => void;
    UnauthorizedError: (m: string) => void;
    ForbiddenError: (m: string) => void;
    Timeout: (m: string) => void;
    InternalServer: (m: string) => void;
    DatabaseEngine: (m: string) => void;
    This: (err: {
        code: number;
        message: string;
    }) => void;
};
export { UNKNOWN_ERROR, hasError, raiseError };
