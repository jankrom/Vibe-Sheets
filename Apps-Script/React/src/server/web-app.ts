import { isValidAuthToken } from './auth';
import { processAction } from './tools';

export const SERVER_URL =
  'https://90c4-2601-58c-c081-2430-899-854e-fc4c-a764.ngrok-free.app';

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
export function doPost(e: GoogleAppsScript.Events.DoPost) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Invalid request: No POST data found.');
    }

    const { spreadsheetId, action, data, token } = JSON.parse(
      e.postData.contents
    );
    if (!token || !isValidAuthToken(token)) {
      throw new Error(
        'Authentication failed: Missing or invalid token in payload.'
      );
    }
    if (!spreadsheetId || !action) {
      throw new Error("Invalid request: Missing 'spreadsheetId' or 'action'.");
    }

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getActiveSheet();

    const result = processAction(action, data, sheet, token); // can throw error

    output.setContent(
      JSON.stringify({
        success: true,
        result: result,
      })
    );
  } catch (error) {
    output.setContent(
      JSON.stringify({
        success: false,
        result: (error as Error).message,
      })
    );
  }

  return output;
}
