#!/bin/bash

export DATE=$(date +'%Y-%m-%d-%H%M%S')
export LOGTO=/home/socialcap/logs/dumpdb.log

echo "$DATE dumpdb" >> $LOGTO
sudo -u postgres pg_dump --clean --create --if-exists --verbose socialcapdev > /home/socialcap/dbs/socialcap_export-$DATE.sql
