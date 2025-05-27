function processAction(action, data, sheet) {
  let result = ""
  switch (action) {
    case "getAllData":
      result = sheet.getDataRange().getValues()
      break
    case "appendRow":
      if (!data) {
        throw new Error("Missing data for appendRow action.")
      }
      sheet.appendRow(data)
      result = "Row appended successfully."
      break
    case "setCellValuesInRange":
      if (!data || !data.range || !data.values) {
        throw new Error(
          "Missing 'range' or 'values' for setCellValuesInRange action."
        )
      }
      sheet.getRange(data.range).setValues(data.values)
      result = `Values set successfully in range ${data.range}.`
      break
    case "clearCellContentInRange":
      if (!data) {
        throw new Error("Missing 'range' for clearCellContentInRange action.")
      }
      sheet.getRange(data).clearContent()
      result = `Content cleared in range ${data}.`
      break
    case "deleteRows":
      if (
        !data ||
        typeof data.rowIndex !== "number" ||
        typeof data.numRows !== "number"
      ) {
        throw new Error(
          "Missing 'rowPosition' or 'howMany' for deleteRows action."
        )
      }
      sheet.deleteRows(data.rowIndex, data.numRows)
      result = `Deleted ${data.numRows} row(s) starting from row ${data.rowIndex}.`
      break
    case "insertRows":
      if (
        !data ||
        typeof data.rowIndex !== "number" ||
        typeof data.numRows !== "number"
      ) {
        throw new Error(
          "Missing 'rowIndex' or 'numRows' for insertRows action."
        )
      }
      sheet.insertRows(data.rowIndex, data.numRows)
      result = `Inserted ${data.numRows} row(s) at row ${data.rowIndex}.`
      break
    case "clearEntireSheet":
      sheet.clear()
      result =
        "The entire sheet has been cleared, including all content and formatting."
      break
    default:
      throw new Error(`Unsupported action: ${action}`)
  }
  return result
}
