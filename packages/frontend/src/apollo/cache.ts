import { InMemoryCache } from '@apollo/client';
import { skipLimitPagination } from './pagination';

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        nfts: skipLimitPagination(),
      },
    },
  },
});
