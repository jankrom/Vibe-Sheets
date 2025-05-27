import invokeAIAgent from "./ai-agent"

export type Message = { role: "user" | "assistant"; content: string }

const processChatMessage = async (
  spreadsheetId: string,
  messages: Message[]
) => {
  const response = await invokeAIAgent(spreadsheetId, messages)
  return {
    response: response,
  }
}
export default processChatMessage
