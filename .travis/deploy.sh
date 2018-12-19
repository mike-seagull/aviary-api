#!/usr/bin/env bash
# stop the service
ssh ${REMOTE_USER}@${REMOTE_SERVER} "/usr/bin/sudo systemctl stop home-api-node"
# scp the binary
scp ./bin/home-api-node ${REMOTE_USER}@${REMOTE_SERVER}:/usr/local/bin/home-api-node
ssh ${REMOTE_USER}@${REMOTE_SERVER} "/bin/chmod +x /usr/local/bin/home-api-node"
# start the service
ssh ${REMOTE_USER}@${REMOTE_SERVER} "/usr/bin/sudo systemctl start home-api-node"