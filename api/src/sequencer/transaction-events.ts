/**
 * Manages posting and retrieval of the Transactionevents.
 * Ideally, we should use something like NATS.io for this.
 */
import { prisma } from "../global.js";
import { WAITING, DONE } from '@socialcap/contracts';
import { SequencerLogger as log } from "./logs.js";

export { 
  postTxnEvent, 
  TxnEvent,
  WAITING
};

interface TxnEvent {
  type: string;
  to: string;
  payload: object; // A parsed JSON object
}


/**
 * Posts a new TransactionEvent so other consumers can access and get it.
 * In general, the event is going to be consumed just one time, and only once,
 * by the target destination.
 */
async function postTxnEvent(
  ev: TxnEvent
): Promise<any> {
  let txnEv = await prisma.transactionEvent.create({
    data: {
      type: ev.type, 
      to: ev.to,
      payload: JSON.stringify(ev.payload),
      emittedUTC: (new Date()).toISOString(),
      state: WAITING
    }
  })

  return txnEv;
}


/**
 * Acknowledges a given TransactionEvent, so it will not be processed again.
 * @param id is the sequence id (autoincremented) of this event
 */
async function ackTxnEvent(
  id: number
): Promise<any> {
  let txnEv = await prisma.transactionEvent.update({
    where: { sequence: id },
    data: {
      state: DONE
    }
  })
  return txnEv;
}


// TODO
// getTxnEvents(type) // only gets WAITING events of the given type
