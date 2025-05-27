import processChatMessage from "@/lib/ai/process-chat-message"

export async function POST(request: Request) {
  const { spreadsheet_id: spreadsheetId, messages } = await request.json()

  console.log("Received request:", { spreadsheetId, messages })
  if (!messages || !spreadsheetId) {
    return new Response("Invalid input", { status: 400 })
  }

  const response = await processChatMessage(spreadsheetId, messages)

  return new Response(JSON.stringify(response), { status: 200 })
}
