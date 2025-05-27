function processAction(action, data, sheet) {
  let result = ""
  switch (action) {
    case "appendRow":
      if (!data) {
        throw new Error("Missing data for appendRow action.")
      }
      sheet.appendRow(data)
      result = "Row appended successfully."
      break
    default:
      throw new Error(`Unsupported action: ${action}`)
  }
  return result
}
