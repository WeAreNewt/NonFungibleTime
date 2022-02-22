module.exports = {
  client: {
    includes: ['./src/lib/graphql/**.graphql'],
    service: {
      name: 'NonFungibleTime',
      // Needs to be set manually.
      url: process.env.REACT_APP_SELECTED_ENVIRONMENT === 'production' ?  
        'https://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-polygon' :
        'https://api.thegraph.com/subgraphs/name/wearenewt/non-fungible-time-mumbai'
    },
  },
};
