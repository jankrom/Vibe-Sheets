export const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

export function getCurrentSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

export function getSheetData() {
  return getCurrentSheet().getDataRange().getValues();
}
