import { auth } from "@clerk/nextjs/server"

export async function sendTokenToAppScript(
  spreadsheetId: string
): Promise<string> {
  try {
    const { getToken } = await auth()
    const template = "app-script"
    const token = await getToken({ template })
    if (!token) {
      throw new Error("No token found")
    }

    const response = await fetch(`${process.env.APPS_SCRIPT_WEB_APP_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ spreadsheetId, action: "updateAuthToken", token }),
    })
    const responseJson = await response.json()
    if (!responseJson.success) {
      throw new Error("Failed to save token to Google Sheet")
    }

    return "success"
  } catch (error) {
    return `Error signing into your Google Sheet: ${error.message}. Please try again`
  }
}

export async function getTokenFromRequest(
  request: Request
): Promise<string | null> {
  try {
    const authHeader = request.headers.get("Authorization")

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      return token
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting App Script token:", error)
    return null
  }
}
