# Subgraph for Tokenized Time

## Development

```bash
# copy env and add the access token from TheGraph dashboard
cp .env.test .env

# Generate subgraph.yaml manifest based on contract addresses from config directory
npm run prepare:mumbai
npm run prepare:polygon

# Run a test build
npm run build

# To re-generate contract abis
cd ../contracts
npx hardhat compile

# TheGraph currently breaks when trying to deploy a contract using custom error :/
# To deploy you have to manually remove all abi elements with "type": "error" in ../contracts/artifacts/contracts/TimeCollection.sol/TimeCollection.json

# Deploy to production, subgraph deployment slug set in package.json (wearenewt/tokenized-time-mumbai)
npm run deploy:hosted:mumbai
npm run deploy:hosted:polygon
```
