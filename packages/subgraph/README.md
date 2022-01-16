# Subgraph for Tokenized Time

## Development

```bash

# Step 1: Compile abis from contracts package
cd ../contracts
npm install
npx hardhat compile

# Step 2: In subgraph directory, install dependencies
npm install

# Step 3: Generate subgraph.yaml manifest annd subgraph types based on contract addresses from config directory, generated contract abis, and user defined schema (schema.graphql)
npm run prepare:mumbai
npm run prepare:polygon

# Step 4: Run a test build of your subgraph mappings
npm run build

# TheGraph currently breaks when trying to deploy a contract using custom error :/
# To deploy you have to manually remove all abi elements with "type": "error" in ../contracts/artifacts/contracts/NonFungibleTimeCollection.sol/NonFungibleTimeCollection.json

# Step 5: copy .env.test to .env and add your subgraph access token from TheGraph dashboard
cp .env.test .env

# Step 6: Deploy to production, subgraph deployment slug set in package.json (wearenewt/non-fungible-mumbai)
npm run deploy:hosted:mumbai
npm run deploy:hosted:polygon
```
