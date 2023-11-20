

# TODO

Improve the states management

- WAITING
- DONE
- FAILED

Add REVISION state: the Txn has been submitted but is waiting to be included in a block !
This is needed for transaction that have been started and are waiting, but the Sequencer was stopped for any reason, and so we have "hanging" transactions that may have been completed but were not marked as either DONe or FAILED.
