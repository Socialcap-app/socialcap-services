/**
 * Manages posting and retrieval of the Transactionevents.
 * Ideally, we should use something like NATS.io for this.
 */
import { prisma } from "../global.js";
import { WAITING, DONE } from '@socialcap/contracts';
export { postTxnEvent, WAITING };
/**
 * Posts a new TransactionEvent so other consumers can access and get it.
 * In general, the event is going to be consumed just one time, and only once,
 * by the target destination.
 */
async function postTxnEvent(ev) {
    let txnEv = await prisma.transactionEvent.create({
        data: {
            type: ev.type,
            subject: ev.subject,
            payload: JSON.stringify(ev.payload),
            emittedUTC: (new Date()).toISOString(),
            state: WAITING
        }
    });
    return txnEv;
}
/**
 * Acknowledges a given TransactionEvent, so it will not be processed again.
 * @param id is the sequence id (autoincremented) of this event
 */
async function ackTxnEvent(id) {
    let txnEv = await prisma.transactionEvent.update({
        where: { sequence: id },
        data: {
            state: DONE
        }
    });
    return txnEv;
}
// TODO
// getTxnEventsByType(type) // only gets WAITING events of the given type
//# sourceMappingURL=transaction-events.js.map