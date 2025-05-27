import { tool } from "@langchain/core/tools"
import { RunnableConfig } from "@langchain/core/runnables"
import { GoogleCustomSearch } from "@langchain/community/tools/google_custom_search";
import { z } from "zod"

const APPS_SCRIPT_WEB_APP_URL: string = process.env
  .APPS_SCRIPT_WEB_APP_URL as string

export const appendRow = tool(
  async ({ data }: { data: string[] }, config: RunnableConfig) => {
    const spreadsheetId = config.configurable?.spreadsheetId
    try {
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
          `Apps Script Error: ${result.result || "Unknown error"}`
        )
      }

      return result.result
    } catch (error) {
      return `Failed to append row: ${error.message}`
    }
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

export const getAllData = tool(
  async (_, config: RunnableConfig) => {
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
        action: "getAllData",
      }),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(`Apps Script Error: ${result.result || "Unknown error"}`)
    }

    return { spreadsheet_data: result.result }
  },
  {
    name: "get_all_data",
    description:
      "Retrieve all data from the spreadsheet. Result will be a 2D array of strings.",
    schema: z.object({}),
  }
)

const googleSearchTool = new GoogleCustomSearch();

export const tools = [appendRow, getAllData, googleSearchTool]
