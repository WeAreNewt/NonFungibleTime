# Subgraph for Tokenized Time

## Development

```bash
# copy env and adjust its content
cp .env.test .env
# fetch current contracts as submodule
npm run prepare:all
# run codegen
npm run subgraph:codegen
# now you're able to deploy to thegraph via
npm run deploy:hosted:mumbai
```
