import { RunnableConfig } from "@langchain/core/runnables"

const APPS_SCRIPT_WEB_APP_URL: string = process.env
  .APPS_SCRIPT_WEB_APP_URL as string

type ToolType =
  | string[]
  | { range: string; values: string[][] }
  | { rowIndex: number; numRows: number }
  | string
  | undefined

const ProcessTool = async (
  data: ToolType,
  config: RunnableConfig,
  actionName: string
) => {
  try {
    const spreadsheetId = config.configurable?.spreadsheetId
    const JWT = config.configurable?.jwt
    if (!spreadsheetId) {
      throw new Error("Spreadsheet ID not found in the configurable config.")
    }
    if (!JWT) {
      throw new Error("JWT not found in the configurable config.")
    }

    const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spreadsheetId,
        action: actionName,
        data,
        token: JWT,
      }),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(`Apps Script Error: ${result.result || "Unknown error"}`)
    }

    return {
      result: result.result,
      message: `Successfully performed action ${actionName}`,
    }
  } catch (error) {
    return {
      message: `Failed to perform action ${actionName}: ${error.message}`,
    }
  }
}

export default ProcessTool
