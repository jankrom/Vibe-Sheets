const SERVER_URL = "http://localhost:5000"

/**
 * Runs when the spreadsheet is opened, adds a custom menu.
 * @param {object} e The event object.
 */
function onOpen(e) {
  SpreadsheetApp.getUi() // Get the UI object for the spreadsheet
    .createMenu("Vibe Sheet") // Create a new menu named "Vibe Sheets"
    .addItem("Open Vibe Sheet Sidebar", "showMySidebar") // Add an item to the menu
    .addToUi() // Add the menu to the spreadsheet's UI
}

/**
 * Opens the custom sidebar.
 */
function showMySidebar() {
  var htmlOutput =
    HtmlService.createHtmlOutputFromFile("Sidebar").setTitle("Vibe Sheet") // Set the title for the sidebar

  SpreadsheetApp.getUi().showSidebar(htmlOutput) // Show the sidebar
}

/**
 * Receives a message from the sidebar and performs hardcoded actions
 * on the sheet for a demo. Returns a response message.
 * @param {string} message The message sent from the client-side (sidebar).
 * @return {string} The response message to send back to the client.
 */
function processMessage(message) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()

  const sheetData = sheet.getDataRange().getValues() // sheet data in 2D array

  const apiResponse = UrlFetchApp.fetch(SERVER_URL + "/api/process", {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ data: sheetData, message: message }),
  })

  const response = JSON.parse(apiResponse.getContentText())

  return response
}
