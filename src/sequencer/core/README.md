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
- ROLLUP_CLAIM_VOTES

- CREATE_VOTING_BATCHES_ACCOUNT

- RECEIVE_VOTES_BATCH

- COMMIT_ALL_VOTING_BATCHES

Note that for each type we need to implement a new class derived from the abstract `AnyDispatcher` class. 

##### A run cycle

The Sequencer will process the transactions in the order in which were received (FIFO). A cycle of the Sequencer does:

~~~
1. Get all queues that have WAITING or REVISION transactions of the allowed types

2. For each active queue:

  2.1. Check if we have a running transaction on it. If we have, we just pass.

  2.2. If we have no running transactions:

    2.2.1. Retrieve the first one from the Queue (FIFO).

    2.2.2. According to the transaction state:
    
      - WAITING: Dispatch the pending transaction.

        - If proved and sent, mark it for REVISION.
        - If failed, retry it or mark as FAILED
       
      - REVISION: Wait till included in block

        - If finished, mark it as DONE.
        - If failed, retry it or mark as FAILED
        
~~~

##### Transaction states

A transaction in the queue may be in one of several states:

- `WAITING`: indicates a Txn that is waiting to be processed by the Sequencer, or has failed and needs to be retried (retries > 0).
- `REVISION`: indicates a Txn that has been submitted but is waiting to be included in a block. This is needed for transactions that have been successfully sent and are waiting to be finished, but the Sequencer was stopped for any reason, and so we have "hanging" transactions that may have been completed but were not marked as either DONE or FAILED.
- `DONE`: indicates a Txn that has been finished. 
- `FAILED`: indicates a Txn that has failed after many retries, and will not be processed anymore.



#### Transaction queues



Types

- `RawTxnData`: the "raw" transaction data, mainly 'uid', type', and 'data' (where data is an open plain object). 

- `TxnResult`: is a "baton" object used to pass the results of the dispatch, waiting and other methods between invocations.

Methods



#### Dispatchers

Methods

- `dispatch(txnData: RawTxnData)`
- `onFinished(txnData: RawTxnData, result: TxnResult)`

#### Transaction events

