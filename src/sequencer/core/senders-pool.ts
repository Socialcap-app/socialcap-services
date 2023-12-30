/**
 * A pool of Sender accounts used by the dispatchers to sign transactions.
 * 
 * Before dispatching a new transaction, we need to assign a Sender to the 
 * queue. The sender will be attached to this queue until the transaction is 
 * completed (failure or success). After that if will be available again.
 * 
 * If we have no available sender (that is all senders have been assigned to 
 * some queue) we can not dispatch it and we remain WAITING.
 * 
 * WHY ? Having a pool of senders allows us to send more than one transaction
 * per block. The MINA limit is one transaction per block per account, so by
 * having multiple senders we allow simultaneous transactions processing only
 * limited by the senders count.
 * 
 * NOTE: Transactions in the same queue will be processed in the order they 
 * were added to the queue, so this pool only allows parallel execution of
 * different queues.
 */

export { Sender, SendersPool }


interface Sender {
  accountId: string,
  secretKey: string,
  queue: string // must be FREE if not assigned 
}

const FREE = "-"; // marks a FREE sender


class SendersPool {

  static _pool: Sender[] = [];

  static getAvailableSender(): Sender | null {
    SendersPool._pool.forEach((sender) => {
      if (sender.queue === FREE)
        return sender; 
    })
    return null;
  }

  static blockSender(blocked: Sender, queue: string) {
    SendersPool._pool.map((sender, index) => {
      if (sender.accountId === blocked.accountId)
        SendersPool._pool[index].queue = queue; 
    })
  }

  static freeSender(queue: string) {
    SendersPool._pool.map((sender, index) => {
      if (sender.queue === queue)
        SendersPool._pool[index].queue = FREE; 
    })
  }

  /** Add it to the pool. The pool is created when the Sequencer is started
   * and so the pool will not change along the lifetime of a given Sequencer */
  static addSender(accountId: string, secretKey: string) {
    SendersPool._pool.push({
      accountId: accountId,
      secretKey: secretKey,
      queue: FREE
    })
  }
};
