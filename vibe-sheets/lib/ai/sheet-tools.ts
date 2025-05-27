import { tool } from "@langchain/core/tools"
import { RunnableConfig } from "@langchain/core/runnables"
import { z } from "zod"

const APPS_SCRIPT_WEB_APP_URL: string = process.env
  .APPS_SCRIPT_WEB_APP_URL as string

export const appendRow = tool(
  async ({ data }: { data: string[] }, config: RunnableConfig) => {
    const spreadsheetId = config.configurable?.spreadsheetId

    if (!spreadsheetId) {
      throw new Error("Spreadsheet ID not found in the configurable config.")
    }

    const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spreadsheetId,
        action: "appendRow",
        data,
      }),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(
        `Apps Script Error: ${result.error?.message || "Unknown error"}`
      )
    }

    return result.result
  },
  {
    name: "append_row",
    description:
      "Add a new row to the spreadsheet. Input should be an array of strings representing the cell values for the new row.",
    schema: z.object({
      data: z
        .array(z.string())
        .describe("The data to add in the new row, as an array of strings."),
    }),
  }
)
