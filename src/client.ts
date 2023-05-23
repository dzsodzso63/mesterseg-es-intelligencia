import React from 'react';
import { feathers } from '@feathersjs/client';
import rest from '@feathersjs/rest-client'

const client = feathers()

// Connect to a different URL
const restClient = rest(window.location.hostname.indexOf('joszaki.hu') > -1
  ? 'https://mi-api.joszaki.hu'
  : `${window.location.protocol + "//" + window.location.hostname}:3030`);

// Configure an AJAX library (see below) with that client
client.configure(restClient.fetch(window.fetch.bind(window)));

export const SocketContext = React.createContext({});
export default client;
