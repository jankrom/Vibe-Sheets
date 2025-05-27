import { tool } from "@langchain/core/tools"
import { RunnableConfig } from "@langchain/core/runnables"
import { GoogleCustomSearch } from "@langchain/community/tools/google_custom_search"
import { z } from "zod"
import ProcessTool from "./process-tool"

export const appendRow = tool(
  async ({ data }: { data: string[] }, config: RunnableConfig) => {
    const result = await ProcessTool(data, config, "appendRow")
    return result
  },
  {
    name: "append_row",
    description:
      "Add a new row to the spreadsheet. Input should be an array of strings representing the cell values for the new row. Only do this if user explicilty asks to add just one new row and it is obvious they meant at the bottom of the sheet.",
    schema: z.object({
      data: z
        .array(z.string())
        .describe("The data to add in the new row, as an array of strings."),
    }),
  }
)

export const getAllData = tool(
  async (_, config: RunnableConfig) => {
    const result = await ProcessTool(undefined, config, "getAllData")
    return result
  },
  {
    name: "get_all_data",
    description:
      "Retrieve all data from the spreadsheet. Result will be a 2D array of strings.",
    schema: z.object({}),
  }
)

export const setCellValuesInRange = tool(
  async (
    { range, values }: { range: string; values: string[][] },
    config: RunnableConfig
  ) => {
    const result = await ProcessTool(
      { range, values },
      config,
      "setCellValuesInRange"
    )
    return result
  },
  {
    name: "set_cell_values_in_range",
    description:
      "Write or update values in a specific range of cells. Input must be an object with valid spreadsheet 'range' (e.g., 'A1:B2') and 'values' (a 2D array of strings matching the range dimensions).",
    schema: z.object({
      range: z
        .string()
        .describe(
          "The A1 notation of the range to write to (e.g., 'A1', 'B2:C5')."
        ),
      values: z
        .array(z.array(z.string()))
        .describe("The 2D array of values to write to the specified range."),
    }),
  }
)

export const clearCellContentInRange = tool(
  async ({ range }: { range: string }, config: RunnableConfig) => {
    const result = await ProcessTool(range, config, "clearCellContentInRange")
    return result
  },
  {
    name: "clear_cell_content_in_range",
    description:
      "Clears the content of a specified range of cells without deleting the cells or their formatting. Input must be an object with 'range' (e.g., 'A1', 'B2:C5').",
    schema: z.object({
      range: z
        .string()
        .describe(
          "The A1 notation of the range to clear (e.g., 'A1', 'B2:C5')."
        ),
    }),
  }
)

export const deleteRows = tool(
  async (
    { rowIndex, numRows }: { rowIndex: number; numRows: number },
    config: RunnableConfig
  ) => {
    const data = {
      rowIndex,
      numRows,
    }
    const result = await ProcessTool(data, config, "deleteRows")
    return result
  },
  {
    name: "delete_rows",
    description:
      "Deletes one or more rows from the spreadsheet. Input must be an object with 'rowIndex' (the 1-based start row number) and 'numRows' (the number of rows to delete).",
    schema: z.object({
      rowIndex: z
        .number()
        .min(1)
        .describe("The 1-based index of the first row to delete."),
      numRows: z
        .number()
        .min(1)
        .describe("The number of rows to delete, starting from 'rowIndex'."),
    }),
  }
)

export const insertRows = tool(
  async (
    { rowIndex, numRows }: { rowIndex: number; numRows: number },
    config: RunnableConfig
  ) => {
    const data = {
      rowIndex,
      numRows,
    }
    const result = await ProcessTool(data, config, "insertRows")
    return result
  },
  {
    name: "insert_rows",
    description:
      "Inserts a specified number of empty rows at a given 1-based row index. Input must be an object with integers 'rowIndex' and 'numRows'.",
    schema: z.object({
      rowIndex: z
        .number()
        .min(1)
        .describe("The 1-based index where rows should be inserted."),
      numRows: z.number().min(1).describe("The number of rows to insert."),
    }),
  }
)

export const clearEntireSheet = tool(
  async (_, config: RunnableConfig) => {
    const result = await ProcessTool(undefined, config, "clearEntireSheet")
    return result
  },
  {
    name: "clear_entire_sheet",
    description:
      "Clears all content and formatting from the entire active sheet. Use this tool when the user explicitly asks to 'clear the sheet', 'start over', 'empty everything', or something similar. This action is irreversible.",
    schema: z.object({}),
  }
)

const googleSearchTool = new GoogleCustomSearch()

export const tools = [
  appendRow,
  deleteRows,
  insertRows,
  getAllData,
  setCellValuesInRange,
  clearCellContentInRange,
  clearEntireSheet,
  googleSearchTool,
]
