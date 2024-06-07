#!/bin/bash
#!/bin/bash
#
#  Use:
#       ./db-export-all-json.sh
#
export DB=socialcapdev
export DATADIR=/tmp

# before exporting apply all patches
sudo -u postgres psql -d $DB < prisma/fix-columns.sql

# export all to JSON format files
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/merkle_maps.json -c "select row_to_json(t) from merkle_map t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/merkle_map_leafs.json -c "select row_to_json(t) from merkle_map_leaf t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/key_values.json -c "select row_to_json(t) from key_values t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/sessions.json -c "select row_to_json(t) from sessions t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/persons.json -c "select row_to_json(t) from persons t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/communities.json -c "select row_to_json(t) from communities t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/members.json -c "select row_to_json(t) from members t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/claims.json -c "select row_to_json(t) from claims t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/plans.json -c "select row_to_json(t) from plans t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/credentials.json -c "select row_to_json(t) from credentials t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/tasks.json -c "select row_to_json(t) from tasks t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/batches.json -c "select row_to_json(t) from batches t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/states.json -c "select row_to_json(t) from states t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/transaction_queues.json -c "select row_to_json(t) from transaction_queues t;"
sudo -u postgres psql -d $DB -qAtX -o $DATADIR/transaction_events.json -c "select row_to_json(t) from transaction_events t;"
