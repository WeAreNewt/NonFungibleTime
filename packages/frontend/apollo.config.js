module.exports = {
  client: {
    includes: ['./src/graphql/**.graphql'],
    service: {
      name: 'NonFungibleTime',
      url: 'https://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-mumbai',
    },
  },
};
