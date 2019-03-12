#!/bin/bash

npm run build
rsync -r -e "ssh -o StrictHostKeyChecking=no" --delete-after --quiet dist/ $HOST_USER@$HOST_IP:$HOST_DIRECTORY