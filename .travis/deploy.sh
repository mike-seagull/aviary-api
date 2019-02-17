#!/usr/bin/env bash
# stop the service
ssh -o LogLevel=quiet ${REMOTE_USER}@${REMOTE_SERVER} "/usr/bin/sudo systemctl stop aviary-api"
# scp the binary
scp -o LogLevel=quiet ./bin/aviary-api ${REMOTE_USER}@${REMOTE_SERVER}:/usr/local/bin/aviary-api
ssh -o LogLevel=quiet ${REMOTE_USER}@${REMOTE_SERVER} "/bin/chmod +x /usr/local/bin/aviary-api"
# start the service
ssh -o LogLevel=quiet ${REMOTE_USER}@${REMOTE_SERVER} "/usr/bin/sudo systemctl start aviary-api"
