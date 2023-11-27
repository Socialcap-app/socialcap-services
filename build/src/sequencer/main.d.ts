export interface IDispatcherEntry {
    name: string;
    dispatcher: any;
}
export declare function setupSequencer(params: {
    dispatchers: IDispatcherEntry[];
}): void;
export declare function runSequencer(): Promise<void>;
export declare function startSequencer(): void;
