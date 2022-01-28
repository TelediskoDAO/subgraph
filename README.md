# Run node

```
ethnode
# ... deploy contracts

npm install -g @graphprotocol/graph-cli
git clone https://github.com/graphprotocol/graph-node/
cd graph-node/docker
docker-compose up
graph create --node http://localhost:8020/ <subgraph-name>
graph init --product hosted-service --from-contract <address> --allow-simple-name --index-events --contract-name <contract-name> --abi <dir> --network mainnet --protocol ethereum <subgraph-name>
cd <dir>
graph deploy <subgraph-name> -g http://localhost:8020/ -i http://localhost:5001/
```
