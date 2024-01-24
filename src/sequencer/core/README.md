# Sequencer

The Sequencer receives a given transaction, adds it to its transactions queues and dispatches it to its "_zkApp_" when it is the "_right_ time" to do so. 

A `zkApp`  is a given MINA Smart Contract deployed on the MINA Network, and related to a given account, having a unique  "_zkAppAddress_". 

The `zkAppAddress` is the PublicKey of the deployed zkApp, as a string in Base58 format.

The `right time`  means that there is no other transaction _of the same type_ running, and that the previous transaction has been added to a block. That means, **one transaction per block, per zkApp**.

Each Sequencer has associated:

- A set of persistent Transaction Queues, which hold the list of transactions to execute. 

- A set of Dispatchers (one per transaction type) which dispatch (and monitor)  the transactions to execute.

- A set of allowed types, which the Sequencer will process. Other types will be ignored.

##### Transaction types

Currently we are processing the following types:

- CREATE_CLAIM_VOTING_ACCOUNT
- SEND_CLAIM_VOTE
- CREATE_VOTING_BATCHES_ACCOUNT
- RECEIVE_VOTES_BATCH
- COMMIT_ALL_VOTING_BATCHES

Note that for each type we need to implement a new class derived from the abstract `AnyDispatcher` class. 

### A Sequencer run cycle

The Sequencer will process the transactions in the order in which they were received (FIFO). 

A cycle of the Sequencer does:

1. Get all "active" queues: this are the queues that have transactions in the WAITING, REVISION or RETRY state.

2. For each active queue:

    - Check if we have a running transaction on it (queue has a blockedSender). If we have:

        ~~~
        If Txn is in REVISION state and queue is in WAITING_INCLUSION state
        	continue
            
        If Txn is in REVISION state and queue is in INCLUSION state
          change queue state to WAITING_INCLUSION
          we start WaitForInclusion
          when WaitForInclusion has finished 
          	change Txn state to either DONE or RETRY
           	if DONE 
             	change queue state to FREE
           	if RETRY
             	change queue state to RETRY   
           	continue
        
        If Txn is in RETRY state and queue is already in DELAY state
          continue
        
        If Txn is in RETRY state but queue already reached MAX_RETRIES
          change Txn state to FAILED
          change queue state to FREE
          continue
        
        If Txn is in RETRY state and queue is in RETRY state
          change queue state to DELAY
          we start WaitForRetry
          when WaitForRetry has finished
            dispatch Txn
            if dispatcher return Success
              change Txn state to REVISION
              change queue state to INCLUSION
              continue
            if dispatcher returns Error
              change Txn state to RETRY
              change queue state to RETRY
              continue
             
        ~~~
    
    - We have no running transactions on this Queue:
    
        ~~~     
        Retrieve the first one in WAITING state from the Queue (FIFO)
        
        If all senders are taken (no sender available)
         // we need to continue till we can get an available sender
         continue
        
        If we have an available sender
         dispatch Txn
         if dispatcher return Success
           change Txn state to REVISION
           change queue state to INCLUSION
           continue
         if dispatcher returns Error
           change Txn state to RETRY
           change queue state to RETRY
           continue
           
        ~~~

#### Transaction states

A transaction in the queue may be in one of several states:

- `WAITING`: indicates a Txn that is waiting to be processed by the Sequencer, or has failed and needs to be retried (retries > 0).
- `REVISION`: indicates a Txn that has been submitted but is waiting to be included in a block. This is needed for transactions that have been successfully sent and are waiting to be finished, but the Sequencer was stopped for any reason, and so we have "hanging" transactions that may have been completed but were not marked as either DONE or FAILED.
- `RETRY`: indicates a Txn that has failed before but that will be retried with some delay and changing the fee.
- `DONE`: indicates a Txn that has been finished. 
- `FAILED`: indicates a Txn that has failed after many retries, and will not be processed anymore.

#### Transaction queue

All tasks posted to the Sequencer are added to the TransactionQueues list (table), setting a WAITING state on it, and a queue name in which we want to add the task.

A given queue in this list can contain many transactions in different states, but:

- Only one (1) transaction in the queue can be in the RETRY or REVISION state.
- All other transactions may be in  the WAITING, DONE or FAILED state.

While a Queue is busy it is binded to a given Sender (and worker) which is the one who dispatched and signed the Txn. 

When the Txn is finished (either DONE or FAILED) the Queue releases the Sender which can then be used to dispatch another transaction for this or another Queue.

### Senders and workers

A Sender is a given MINA account (with a public and a secret key) which will be used to sign and  dispatch transactions.

Associated to each Sender we launch a remote cloud Worker (a Dispatcher) that will receive the task send to it, process it and dispatch the needed transaction to MINA. 

When we start the Sequencer, we add a list of the available Senders (and its associated Worker) that the Sequencer will have available to do his work.

The Sequencer can then send a pending task in a given queue to one of this Senders, and the Sender will be blocked by this queue until the transaction started by the task is completed (either DONE or FAILED).

A Sender (and its associated Worker) can be in any of the following states:

- `FREE` The sender is free to dispatch transactions and can be binded to any queue.
- `BLOCKED` The sender has been blocked by a given queue which will keep it blocked until it finishes.
- `INCLUSION` The queue has dispatched a transaction with success, and we now need to wait for it to be included in a block, but we have not yet started the "waiting for inclusion" process.
- `WAITING_INCLUSION` We have already started the waiting process, which will query the state of the pending transaction in MINA every N seconds, until it finishes. 
- `RETRY` The queue has dispatched a transaction an received back an error, and so we will need retry it, but we have not yet started the "waiting for retry" process.
- `DELAY` We have already started the waiting process, and will delay for N secs before retrying dispatching the task.

**Worker dispatch call**

The Sequencer will send the Worker the following data when dispatching the task:

- `RawTxnData` The "raw" transaction data: _{ uid: string, type: string, data: object }_.  

- `Sender` The Sender binded to this worker: _{ accountId: string, queue: string, retries: number }_

The Worker will respond with:

- `TxnResult`  A "baton" object used to pass the results of the dispatch and other methods between invocations: _{ hash: string,
   done: object | null,
  error: object | null }_ 


**Worker methods**

- `dispatch(txnData: RawTxnData, sender: Sender): TxnResult`
- `onSuccess(txnData: RawTxnData, result: TxnResult, sender: Sender): TxnResult`
- `onFailure(txnData: RawTxnData, result: TxnResult, sender: Sender): TxnResult`

