module.exports = {
  client: {
    includes: ['./src/lib/graphql/**.graphql'],
    service: {
      name: 'NonFungibleTime',
      // Needs to be set manually.
      url: 'https://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-polygon',
    },
  },
};
