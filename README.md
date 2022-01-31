
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
