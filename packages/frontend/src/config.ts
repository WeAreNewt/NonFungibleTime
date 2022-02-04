import { Maybe } from './types';

function notEmpty(value: Maybe<string>, message: string): string {
  if (value !== undefined && value !== null && value !== '') {
    return value;
  }

  throw new Error(`Non empty value expected, received ${String(value)} with message: ${message}`);
}

export const config = {
  THEGRAPH_URI: notEmpty(
    process.env.REACT_APP_THEGRAPH_URI,
    'REACT_APP_THEGRAPH_URI is missing. Did you forgot to setup the .env file?'
  ),
};
