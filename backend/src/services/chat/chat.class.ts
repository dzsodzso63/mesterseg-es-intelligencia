// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import { logger } from '../../logger';
import ChatGPTClient from './ChatGPTClient';
import { ChatCompletionRequestMessage } from 'openai';
import professions from './professions';

type Chat = any
type ChatData = any
type ChatPatch = any
type ChatQuery = any

export type { Chat, ChatData, ChatPatch, ChatQuery }

export interface ChatServiceOptions {
  app: Application
}

export interface ChatParams extends Params<ChatQuery> {}


export type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

export type ChatAnswer = {
  chatMessage: ChatMessage;
  linkSuggestions: any;
}

const sendChatRequest = async (messages: ChatCompletionRequestMessage[], model?: string) => {
  try {
    const client = new ChatGPTClient(model)
    const result = await client.respond(messages, model)
    console.log(messages)
    console.log(result)
    return result.text;
  } catch (error) {
    console.log('E: ', error);
    throw new Error(error as string);
  }
}


// This is a skeleton for a custom service class. Remove or add the methods you need here
export class ChatService<ServiceParams extends ChatParams = ChatParams>
  implements ServiceInterface<Chat, ChatData, ServiceParams, ChatPatch>
{
  constructor(public options: ChatServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Chat[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Chat> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: ChatData, params?: ServiceParams): Promise<ChatAnswer> {
    // if (Array.isArray(data)) {
    //   return Promise.all(data.map((current) => this.create(current, params)))
    // }
    logger.info('data')
    console.log(data)
    const conversation = data.chat.reduce((acc: string, curr: ChatMessage) => `${acc}\n${curr.role === 'bot' ? 'Jószaki' : 'Megrendelő'}: ${curr.text.replace('Jószaki: ', '')}`, '')
    const conversationMegrendelo = data.chat.filter((chatMessage:ChatMessage)=>chatMessage.role !=='bot').reduce((acc: string, curr: ChatMessage) => `${acc}\n${curr.text}`, '')
    const chatGptMessages: ChatCompletionRequestMessage[] = [
      {
        "role": "user", "content": `Egészítsd ki az alábbi párbeszédet a Jószaki válaszával. A Jószaki egy szakember bot. Egyszerre csak 1 kérdést tehet fel. A beszélgetés során a Jószaki bot célja, hogy a Megrendelő elégedetten távozzon és minden felmerülő kérdésére választ kapjon. A Jószaki válaszai mindig lényegretörőek és rövidek legyenek. A Jószaki egy chat bot, ezért olyan kérdést ne tegyen fel ami embert igényel (pl. ne ajánljon fel találkozót vagy telefonhívást).
--- párbeszéd
${conversation}
` },
    ];
//     const chatGptMessages2: ChatCompletionRequestMessage[] = [{
//       role: 'user',
//       content: `--- szakmalista
// ${professions}
// --- párbeszéd a Megrendelővel
// ${conversationMegrendelo}
// "
// ---- kérdés
// Sorold fel, hogy a fenti szakmalistából melyek a leginkább releváns szakmák a párbeszéd alapján és hol van a munka. Legfeljebb 3 munkát sorolj fel. A választ  az alábbi JSON formátumban add vissza:
// {"szakmalista": ["szakma1",  ...], "Varosok": ["város1", "város2", ...]}. A városlista csak a város teljes nevét tartalmazza, kerületet ne. Ha nincs megadva város, akkor legyen a városlista [].
// `    }];
    const chatGptMessages2: ChatCompletionRequestMessage[] = [{
      role: 'user',
      content: `--- szakmalista
${professions}
--- A Megrendelő megjegyzése
${conversationMegrendelo}
---- kérdés
1. Van-e releváns szakma a fenti szakmalistában a Megrendelő megjegyzésése alapján? (Igen vagy Nem)
2. Ha Igen, válaszd ki a releváns szakmákat a fenti szakmalistából ("szakmalista") egy JSON tömbbe
3. Szerepel-e konkrét városnév a Megrendelő megjegyzésében (Igen vagy Nem)
4. Ha Igen, sorold fel a releváns városok teljes nevét ("varoslista") egy JSON tömbbe
`    }];
    const [result, result2] = await Promise.all([
      sendChatRequest(chatGptMessages, data.model),
      sendChatRequest(chatGptMessages2, data.model),
    ]);
    logger.info('response')
    // logger.info(response)

    const lines = result2?.split("\n") || [];
    const szakmalista = JSON.parse(lines[1]?.match(/\[.+?\]/g)?.[0]||"[]");
    const Varosok = JSON.parse(lines[3]?.match(/\[.+?\]/g)?.[0]||"[]");
    
    return {
      chatMessage: {
        role: 'bot',
        text: result ||'',
      },
      linkSuggestions: {
        szakmalista,
        Varosok,
      },
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: ChatData, _params?: ServiceParams): Promise<Chat> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: ChatPatch, _params?: ServiceParams): Promise<Chat> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Chat> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
