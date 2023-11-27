import { WAITING } from '@socialcap/contracts';
export { postTxnEvent, TxnEvent, WAITING };
interface TxnEvent {
    type: string;
    subject: string;
    payload: object;
}
/**
 * Posts a new TransactionEvent so other consumers can access and get it.
 * In general, the event is going to be consumed just one time, and only once,
 * by the target destination.
 */
declare function postTxnEvent(ev: TxnEvent): Promise<any>;
