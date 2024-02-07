#!/bin/bash
export DATE=$(date +'%Y-%m-%d-%H%M%S')

sudo -u postgres pg_dump --clean --create --if-exists --verbose socialcapdev > ~/tmp/socialcap_export-$DATE.sql
