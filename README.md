*For the Teledisko DAO graph-node configuration, check [./provision](./provision.md).*

# Connect to the production server

To manage containers, update the subgraph: `ssh worker@graph.dao.teledisko.com`

To admin the server: `ssh root@graph.dao.teledisko.com`

## Troubleshooting

### Deploy a new subgraph

Make sure you've updated all contract addresses (if https://github.com/TelediskoDAO/subgraph/issues/9 has not been implemented) in the `dao/subgraph.yaml` file. Update `startBlock` if needed.

Connect to worker@graph.dao.teledisko.com, run `tmux attach` to connect to the current tmux session, go to `/home/worker/subgraph/dao`, run 

- staging instance: `pnpm run remove-local ; pnpm run create-local ; pnpm deploy-staging`
- production instance: `pnpm run remove-local ; pnpm run create-local ; pnpm deploy-production`

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

### It doesn't index

I (Alberto) think it's related to this log message `INFO Scanning blocks [0, 0], range_size: 1 [...]`. I noticed that in testnet the genesis block changes (do they cleanup the chain every now and then?). Anyway in our `.env` file we have the entry `GENESIS_BLOCK=<number>`, it seems to me that if this number is wrong (because the chain has been cleaned up, and it doesn't exist anymore) then the indexing doesn't work. What you should do in that case is check whenver the genesis block changed (I did a binary search in their [explorer](https://evm.evmos.dev/block/10065521/transactions)), update the env, restart docker compose.

# Installation
```
npm install -g @graphprotocol/graph-cli
```

# Local development

## Setup
```
# make sure your env contains the following variable
ETHEREUM=<tevmos:https://eth.bd.evmos.dev:8545 | evmos:https://eth.bd.evmos.org:8545>
GENESIS_BLOCK=<genesis block>

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
