module.exports = {
  client: {
    includes: ['./src/graphql/**.graphql'],
    service: {
      name: 'NonFungibleTime',
      // Needs to be set manually.
      url: 'https://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-mumbai',
    },
  },
};
