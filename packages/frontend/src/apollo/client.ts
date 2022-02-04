import { ApolloClient, InMemoryCache } from '@apollo/client';

export type ApolloClientConfig = {
  uri: string;
};

export const createApolloClient = (config: ApolloClientConfig) => {
  const client = new ApolloClient({
    uri: config.uri,
    cache: new InMemoryCache(),
  });

  return client;
};
