#! /bin/sh

docker run \
  --volume=/var/run/docker.sock:/var/run/docker.sock \
  --env=DRONE_RPC_SERVER="http://localhost:8081" \
  --env=DRONE_RPC_SECRET="2a853563a5ffa2099f4fda3242cc71d4" \
  --env=DRONE_RUNNER_CAPACITY=2 \
  --env=DRONE_RUNNER_NAME="localhost" \
  --restart=always \
  --detach=true \
  --name=agent \
  drone/agent:1.0.0-rc.5