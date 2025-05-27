import processChatMessage from "@/lib/ai/process-chat-message"
import { QUERIES } from "@/lib/db/db"

export async function POST(request: Request) {
  let { spreadsheet_id: spreadsheetId, messages } = await request.json()

  if (!messages || !spreadsheetId) {
    return new Response("Invalid input", { status: 400 })
  }

  const old_messages = await QUERIES.getAllMessages()
  messages = [...old_messages.messages, ...messages]

  try {
    const response = await processChatMessage(spreadsheetId, messages)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.error("Error processing chat message:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
