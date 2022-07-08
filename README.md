*For the Teledisko DAO graph-node configuration, check [./provision](./provision.md).*

# Connect to the production server

To manage containers, update the subgraph: `ssh worker@graph.dao.teledisko.com`

To admin the server: `ssh root@graph.dao.teledisko.com`

## Troubleshooting

### Deploy a new subgraph

Make sure you've updated all contract addresses (if https://github.com/TelediskoDAO/subgraph/issues/9 has not been implemented).

Connect to worker@graph.dao.teledisko.com, run `tmux attach` to connect to the current tmux session, go to `/home/worker/subgraph/dao`, run `pnpm run remove-local ; pnpm run create-local ; pnpm deploy-local`

### Contract changed? Update and regenerate ABI

TBD

### ERRO the genesis block hash for chain tevmos has changed from X to Y since the last time we ran, component: BlockStore

See: https://github.com/graphprotocol/graph-node/issues/3655

Solution: stop docker compose, remove `/home/worker/subgraph/data` dir, restart docker compose.

### ERRO Connection to provider failed when connecting to TEVMOS

See: https://github.com/graphprotocol/graph-node/issues/3699

Solution:
- check if the testnet has been restarted and recreated using a new genesis file: https://github.com/evmos/testnets
- if so, check the new lowest block number
- update the lowest block number in `docker-compose.yml`, env variable `GRAPH_ETHEREUM_GENESIS_BLOCK_NUMBER`


# Installation
```
npm install -g @graphprotocol/graph-cli
```

# Local development

## Setup
```
# install and run ethnode or ganache-cli
# deploy contracts locally

git clone https://github.com/graphprotocol/graph-node/
cd graph-node/docker
docker-compose up
```

## Deploy locally
```
graph create --node http://localhost:8020/ <subgraph-name>
graph init --product hosted-service --from-contract <address> --allow-simple-name --index-events --contract-name <contract-name> --abi <dir> --network mainnet --protocol ethereum <subgraph-name>
graph deploy <subgraph-name> -g http://localhost:8020/ -i http://localhost:5001/
```

# Use hosted service (aka staging)

## Setup
```
# deploy the contract to rinkeby, remember the transaction id
# go to https://thegraph.com/hosted-service/ in the dashboard
# select the TelediskoDAO account
# add a new subgraph if necessary
# grab the Access Token and authenticate
 
graph auth --product hosted-service $ACCESS_TOKEN
```

## Deploy
```
graph init --product hosted-service --from-contract <address> --allow-simple-name --index-events --contract-name <contract-name> --abi <dir> --network rinkeby --protocol ethereum TelediskoDAO/<subgraph-name>
cd <subgraph-name>
# visit rinkeby.etherscan.io and get the block number of the contract transaction id
# open "subgraph.yml" and under the "source" node add "startBlock: <block number>"
graph deploy --product hosted-service TelediskoDAO/<subgraph-name>
```

You should now see the indexed graph on the dashboard.
