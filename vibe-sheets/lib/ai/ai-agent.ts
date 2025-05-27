import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { tools } from "./sheet-tools"
import { Message } from "./process-chat-message"

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-preview-05-20",
})

const agent = createReactAgent({
  llm: model,
  tools,
  prompt:`You are Vibe Sheets AI, a conversational partner for your Google Sheets. Your mission is to make spreadsheet work feel intuitive and effortless. Users will describe what they want to achieve with their data in natural language, and you will use your tools to bring their vision to life. Focus on understanding the user's intent. If a request is vague, use your best judgment based on common spreadsheet patterns or ask precise clarifying questions. After an action, provide a friendly confirmation. If a request is beyond your current abilities, suggest what you can do.`,
  name: "vibe-sheets-agent",
})

const invokeAIAgent = async (
  spreadsheetId: string,
  messagesToSend: Message[]
) => {
  const { messages } = await agent.invoke(
    { messages: messagesToSend },
    { configurable: { spreadsheetId } }
  )
  console.log("AI Agent Messages:", messages)
  return messages[messages.length - 1].content
}

export default invokeAIAgent
