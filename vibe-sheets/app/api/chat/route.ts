import processChatMessage from "@/lib/ai/process-chat-message"
import { getTokenFromRequest } from "@/lib/auth/app-script-token"
import { isUserSignedIn } from "@/lib/auth/auth-verification"

export async function POST(request: Request) {
  try {
    const isSignedIn = await isUserSignedIn()
    if (!isSignedIn) {
      return Response.json(
        { error: "Error: No signed in user" },
        { status: 401 }
      )
    }
    const JWT: string | null = await getTokenFromRequest(request)
    if (!JWT) return new Response("Not authorized", { status: 401 })

    const requestJson = await request.json()
    const {
      spreadsheet_id: spreadsheetId,
      message,
    }: { spreadsheet_id: string; message: string } = requestJson

    if (!message || !spreadsheetId) {
      return new Response("Invalid input", { status: 400 })
    }

    const response = await processChatMessage(spreadsheetId, message, JWT)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.error("Error processing chat message:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
