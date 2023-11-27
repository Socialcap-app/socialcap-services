export { waitForTransaction };
declare function waitForTransaction(txnId: string, params: any, onSuccess: (params: any) => void, onError: (params: any, error: any) => void): Promise<void>;
