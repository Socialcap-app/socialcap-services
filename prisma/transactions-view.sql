-- View: public.transactions_view

-- DROP VIEW public.transactions_view;

CREATE OR REPLACE VIEW public.transactions_view
 AS
 SELECT transaction_queues.uid,
    transaction_queues.sequence,
    transaction_queues.queue,
    transaction_queues.type,
    transaction_queues.state,
        CASE
            WHEN transaction_queues.state = 101 THEN 'WAITING'::text
            WHEN transaction_queues.state = 102 THEN 'REVISION'::text
            WHEN transaction_queues.state = 103 THEN 'DONE'::text
            WHEN transaction_queues.state = 104 THEN 'RETRY'::text
            WHEN transaction_queues.state = 105 THEN 'FAILED'::text
            WHEN transaction_queues.state = 106 THEN 'UNRESOLVED'::text
            WHEN transaction_queues.state = 107 THEN 'DISPATCHING'::text
            ELSE NULL::text
        END AS state_descr,
    transaction_queues.txn_hash,
    transaction_queues.data,
    transaction_queues.received_utc,
    transaction_queues.submited_utc,
    transaction_queues.done_utc,
    transaction_queues.retries,
    transaction_queues.txn_done,
    transaction_queues.txn_error
   FROM transaction_queues
  ORDER BY transaction_queues.sequence DESC;

ALTER TABLE public.transactions_view
    OWNER TO postgres;

