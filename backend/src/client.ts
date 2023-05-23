// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'

import { chatClient } from './services/chat/chat.shared'
export type { Chat, ChatData, ChatQuery, ChatPatch } from './services/chat/chat.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.set('connection', connection)

  client.configure(chatClient)
  return client
}
