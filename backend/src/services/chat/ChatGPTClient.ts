import { OpenAIApi, Configuration, CreateChatCompletionRequest, ChatCompletionRequestMessage } from 'openai';

class ChatGPTClient{
    private openAI: OpenAIApi;

    constructor(model: string='gpt-3.5-turbo') {

        const configuration = new Configuration({
            apiKey: model === 'gpt-3.5-turbo' ? process.env.OPENAI_API_KEY_3 : process.env.OPENAI_API_KEY,
        });
        this.openAI = new OpenAIApi(configuration);
    }

    async respond(chatGPTMessages: Array<ChatCompletionRequestMessage>, model='gpt-3.5-turbo') {
        try {
            if (!chatGPTMessages) {
                return {
                    text: 'No chatGPTMessages',
                };
            }

            const request: CreateChatCompletionRequest = {
                messages: chatGPTMessages,
                model,
                temperature: 0,
                n: 1,
            };

            const response = await this.openAI.createChatCompletion(request);
            if (!response.data || !response.data.choices) {
                
                return {
                    text: "The bot didn't respond. Please try again later.",
                };
            }

            return {
                text: response.data.choices[0].message?.content,
                messageId: response.data.id,
            };
        } catch (error) {
            console.log('E: ', error);
            throw new Error(error as string);
        }
    }
}

export default ChatGPTClient;
