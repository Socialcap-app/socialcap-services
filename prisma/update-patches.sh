#!/bin/bash
#
# Use:
#       sh prisma/update-views.sh  # updates socialcap views
# or:
#       sh prisma/update-views.sh dev # updates socialcapdev views
#
sudo -u postgres psql -d socialcap$1 < prisma/fix-columns.sql
sudo -u postgres psql -d socialcap$1 < prisma/claims-view.sql
sudo -u postgres psql -d socialcap$1 < prisma/tasks-view.sql
sudo -u postgres psql -d socialcap$1 < prisma/transactions-view.sql
sudo -u postgres psql -d socialcap$1 < prisma/plans-view.sql
sudo -u postgres psql -d socialcap$1 < prisma/members-view.sql
sudo -u postgres psql -d socialcap$1 < prisma/credentials-view.sql

