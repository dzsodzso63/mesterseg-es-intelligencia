// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Chat, ChatData, ChatPatch, ChatQuery, ChatService } from './chat.class'

export type { Chat, ChatData, ChatPatch, ChatQuery }

export type ChatClientService = Pick<ChatService<Params<ChatQuery>>, (typeof chatMethods)[number]>

export const chatPath = 'chat'

export const chatMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const chatClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(chatPath, connection.service(chatPath), {
    methods: chatMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [chatPath]: ChatClientService
  }
}
