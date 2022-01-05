# Subgraph for Tokenized Time

## Development

```bash
# copy env and add the access token from TheGraph dashboard
cp .env.test .env
# Generate subgraph.yaml based on contract addresses from config directory
npm run prepare
# Run codegen to generate types from contracts
npm run subgraph:codegen
# now you're able to deploy to thegraph on any of the supported networks via
npm run deploy:hosted:mumbai
npm run deploy:hosted:polygon
```
