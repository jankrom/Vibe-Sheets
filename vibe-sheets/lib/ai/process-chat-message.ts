import invokeAIAgent from "./ai-agent"
import { QUERIES } from "../db/db"
import { BaseMessage, HumanMessage } from "@langchain/core/messages"

const processChatMessage = async (
  spreadsheetId: string,
  userMessage: string,
  JWT: string
) => {
  const old_messages: BaseMessage[] = await QUERIES.getAllMessages()
  const all_messages: BaseMessage[] = [
    ...old_messages,
    new HumanMessage(userMessage),
  ]
  const response = await invokeAIAgent(spreadsheetId, all_messages, JWT)
  return {
    response: response,
  }
}
export default processChatMessage
