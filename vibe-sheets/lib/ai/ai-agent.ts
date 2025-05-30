import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { tools } from "./tools/sheet-tools"
import { MUTATIONS } from "../db/db"
import { BaseMessage } from "@langchain/core/messages"

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-preview-05-20",
  // model: "gemini-2.5-pro-preview-05-06",
})

const agent = createReactAgent({
  llm: model,
  tools,
  prompt: `You are Vibe Sheets AI, a conversational partner for your Google Sheets. Your mission is to make spreadsheet work feel intuitive and effortless. Users will describe what they want to achieve with their data in natural language, and you will use your tools to bring their vision to life. Focus on understanding the user's intent. If a request is vague, use your best judgment based on common spreadsheet patterns or ask precise clarifying questions. After an action, provide a friendly confirmation. If a request is beyond your current abilities, suggest what you can do.`,
})

const invokeAIAgent = async (
  spreadsheetId: string,
  messagesToSend: BaseMessage[],
  JWT: string
) => {
  const { messages }: { messages: BaseMessage[] } = await agent.invoke(
    { messages: messagesToSend },
    { configurable: { spreadsheetId, jwt: JWT } }
  )
  MUTATIONS.setMessages(messages)
  return messages[messages.length - 1].content
}

export default invokeAIAgent
