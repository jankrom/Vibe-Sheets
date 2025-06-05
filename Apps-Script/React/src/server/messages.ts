import { SERVER_URL } from './web-app';
import { getSheetData, SPREADSHEET_ID } from './sheets';
import { getAuthToken } from './auth';

/**
 * Receives a message from the sidebar and performs hardcoded actions
 * on the sheet for a demo. Returns a response message.
 * @param {string} message The message sent from the client-side (sidebar).
 * @return {object} The response message to send back to the client.
 */
export function processMessage(message: string): {
  response: string;
  error: string;
} {
  const sheetData = getSheetData(); // sheet data in 2D array
  let AI_response = { response: '', error: '' };

  try {
    const token = getAuthToken();
    const apiResponse = UrlFetchApp.fetch(SERVER_URL + '/api/chat', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: JSON.stringify({
        data: sheetData,
        message,
        spreadsheet_id: SPREADSHEET_ID,
      }),
      muteHttpExceptions: true,
    });
    if (apiResponse.getResponseCode() === 401) {
      return { response: '', error: 'Unauthorized' };
    }
    const response = JSON.parse(apiResponse.getContentText());

    AI_response = { response: response.response, error: '' };
  } catch (error) {
    Logger.log('Error: ' + (error as Error).message);
    AI_response = { error: '', response: 'Error: ' + (error as Error).message };
  }

  return AI_response;
}
