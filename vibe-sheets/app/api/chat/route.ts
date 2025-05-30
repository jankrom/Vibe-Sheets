import processChatMessage from "@/lib/ai/process-chat-message"
import { isUserSignedIn } from "@/lib/auth/auth-verification"
import { QUERIES, MUTATIONS } from "@/lib/db/db"

export async function POST(request: Request) {
  try {
    const isSignedIn = await isUserSignedIn()
    if (!isSignedIn) {
      return Response.json(
        { error: "Error: No signed in user" },
        { status: 401 }
      )
    }

    let { spreadsheet_id: spreadsheetId, messages } = await request.json()

    if (!messages || !spreadsheetId) {
      return new Response("Invalid input", { status: 400 })
    }

    const old_messages = await QUERIES.getAllMessages()
    messages = [...old_messages, ...messages]

    MUTATIONS.addMessage({
      role: "user",
      content: messages[messages.length - 1].content,
    })

    const response = await processChatMessage(spreadsheetId, messages)
    MUTATIONS.addMessage({
      role: "assistant",
      content: response.response as string,
    })
    console.log("Response from AI:", response.response)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.error("Error processing chat message:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
