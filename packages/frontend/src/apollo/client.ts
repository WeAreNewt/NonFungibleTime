import { WebSocketLink } from '@apollo/client/link/ws';
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

export type ApolloClientConfig = {
  httpUri: string;
  wsUri: string;
};

export const createApolloClient = (config: ApolloClientConfig) => {
  const httpLink = new HttpLink({
    uri: config.httpUri,
  });

  const wsLink = new WebSocketLink({
    uri: config.wsUri,
    options: {
      reconnect: true,
    },
  });

  // The split function takes three parameters:
  //
  // * A function that's called for each operation to execute
  // * The Link to use for an operation if the function returns a "truthy" value
  // * The Link to use for an operation if the function returns a "falsy" value
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return client;
};
