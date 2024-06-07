#!/bin/bash
#
#  Use:
#       ./db-import-all-json.sh
#
export DATE=$(date +'%Y%m%d')
export BUILD=build/src/tools
export DATADIR=/tmp
export LOG=$DATADIR/import.log

# compile 
npm run build

# completely rebuild schema and reset db
npx prisma migrate reset
npx prisma migrate dev

# run fixes and add non-prisma views
sh prisma/update-patches.sh dev

# run all import scripts
node $BUILD/import-json.js $DATADIR/merkle_maps.json merkleMap > $LOG
node $BUILD/import-json.js $DATADIR/merkle_map_leafs.json merkleMapLeaf  >> $LOG
node $BUILD/import-json.js $DATADIR/key_values.json kvStore >> $LOG
node $BUILD/import-json.js $DATADIR/sessions.json session >> $LOG
node $BUILD/import-json.js $DATADIR/persons.json person >> $LOG
node $BUILD/import-json.js $DATADIR/members.json member >> $LOG
node $BUILD/import-json.js $DATADIR/communities.json community >> $LOG
node $BUILD/import-json.js $DATADIR/claims.json claim >> $LOG
node $BUILD/import-json.js $DATADIR/plans.json plan >> $LOG
node $BUILD/import-json.js $DATADIR/credentials.json credential >> $LOG
node $BUILD/import-json.js $DATADIR/tasks.json task >> $LOG
node $BUILD/import-json.js $DATADIR/batches.json batch >> $LOG
node $BUILD/import-json.js $DATADIR/transaction_queues.json transactionQueue >> $LOG
node $BUILD/import-json.js $DATADIR/transaction_events.json transactionEvent >> $LOG
node $BUILD/import-json.js $DATADIR/states.json state >> $LOG

# just to be sure :-)
#cat $LOG
