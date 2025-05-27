const SERVER_URL =
  "https://909b-2601-58c-c081-2430-8dcd-cda8-64ad-6f4d.ngrok-free.app"
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId()

function onOpen(e) {
  SpreadsheetApp.getUi() // Get the UI object for the spreadsheet
    .createMenu("Vibe Sheet") // Create a new menu named "Vibe Sheets"
    .addItem("Open Vibe Sheet Sidebar", "showMySidebar") // Add an item to the menu
    .addToUi() // Add the menu to the spreadsheet's UI
}

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
  let AI_response = ""

  try {
    const apiResponse = UrlFetchApp.fetch(SERVER_URL + "/api/chat", {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        data: sheetData,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        spreadsheet_id: SPREADSHEET_ID,
      }),
    })
    const response = JSON.parse(apiResponse.getContentText())

    AI_response = response.response
  } catch (error) {
    Logger.log("Error: " + error.message)
    AI_response = "Error: " + error.message
  }

  return AI_response 
}

/**
 * Apps Script Web App doPost function to receive and process
 * structured requests from an external backend.
 *
 * This function handles requests to interact with a specific Google Sheet,
 * identified by its ID, and performs actions based on the 'action' and 'data'
 * provided in the JSON payload.
 *
 * It includes error handling for permission issues and other exceptions.
 *
 * @param {GoogleAppsScript.Events.DoPost} e The event object containing the HTTP POST request data.
 * @return {GoogleAppsScript.Content.TextOutput} A JSON response indicating success or failure.
 */
function doPost(e) {
  const output = ContentService.createTextOutput()
  output.setMimeType(ContentService.MimeType.JSON)

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Invalid request: No POST data found.")
    }

    const { spreadsheetId, action, data } = JSON.parse(e.postData.contents)
    if (!spreadsheetId || !action) {
      throw new Error("Invalid request: Missing 'spreadsheetId' or 'action'.")
    }

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
    const sheet = spreadsheet.getActiveSheet()

    const result = processAction(action, data, sheet) // can throw error

    output.setContent(
      JSON.stringify({
        success: true,
        result: result,
      })
    )
  } catch (error) {
    output.setContent(
      JSON.stringify({
        success: false,
        result: error.message,
      })
    )
  }

  return output
}
