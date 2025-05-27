import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { appendRow } from "./sheet-tools"
import { Message } from "./process-chat-message"

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-preview-05-20",
})

const agent = createReactAgent({
  llm: model,
  tools: [appendRow],
})

const invokeAIAgent = async (spreadsheetId: string, messagesToSend: Message[]) => {
  const { messages } = await agent.invoke(
    { messages: messagesToSend },
    { configurable: { spreadsheetId } }
  )

  return messages[messages.length - 1].content
}

export default invokeAIAgent
