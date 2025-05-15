/**
 * Runs when the spreadsheet is opened, adds a custom menu.
 * @param {object} e The event object.
 */
function onOpen(e) {
  SpreadsheetApp.getUi() // Get the UI object for the spreadsheet
      .createMenu('Vibe Sheet') // Create a new menu named "Vibe Sheets"
      .addItem('Open Vibe Sheet Sidebar', 'showMySidebar') // Add an item to the menu
      .addToUi(); // Add the menu to the spreadsheet's UI
}

/**
 * Opens the custom sidebar.
 */
function showMySidebar() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Vibe Sheet'); // Set the title for the sidebar

  SpreadsheetApp.getUi().showSidebar(htmlOutput); // Show the sidebar
}

/**
 * Receives a message from the sidebar and performs hardcoded actions
 * on the sheet for a demo. Returns a response message.
 * @param {string} message The message sent from the client-side (sidebar).
 * @return {string} The response message to send back to the client.
 */
function processMessage(message) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lowerCaseMessage = message.toLowerCase().trim(); // Convert message to lowercase for easier matching
  var response = "Understood. Let me see what I can do..."; // Default response

  // --- Hardcoded Demo Logic ---

  if (lowerCaseMessage.includes("make a budgeting sheet")) {
    // Action 1: Create a simple budgeting table
    sheet.clearContents(); // Clear existing data for a clean start

    var header = ["Month", "Income", "Costs", "Monthly Net Income"];
    var data = [
      ["January", 3500, 2200, ""],
      ["February", 3700, 2350, ""],
      ["March", 3600, 2100, ""],
      ["April", 3800, 2500, ""],
      ["May", 3900, 2600, ""],
      ["June", 3750, 2250, ""],
      ["July", 3550, 2300, ""],
      ["August", 3850, 2400, ""],
      ["September", 3950, 2550, ""],
      ["October", 4100, 2700, ""],
      ["November", 4000, 2450, ""],
      ["December", 4200, 2800, ""]
    ];

    // Calculate Net Income for each row
    for (var i = 0; i < data.length; i++) {
      var income = data[i][1];
      var costs = data[i][2];
      if (typeof income === 'number' && typeof costs === 'number') {
         data[i][3] = income - costs;
      }
    }


    // Set headers starting at A1
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
    // Set data starting at A2
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);

    // Optional: Bold headers
    sheet.getRange(1, 1, 1, header.length).setFontWeight('bold');

    response = "Okay, I've created a basic budgeting table for you.";

  } else if (lowerCaseMessage.includes("include decimals")) {
    // Action 2: Format numeric columns to include decimals (e.g., 0.00)

    // Assuming data starts from row 2 and is in columns B, C, D
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) { // Check if there is data besides the header
      // Get the range containing Income, Costs, and Monthly Net Income data
      var dataRange = sheet.getRange(2, 2, lastRow - 1, 3); // Starts row 2, col 2 (B), covers 3 columns

      // Set number format to two decimal places
      dataRange.setNumberFormat('0.00');
      response = "I've updated the values to include decimals.";
    } else {
      response = "There doesn't seem to be any data to format yet. Try creating the budgeting app first.";
    }


  } else if (lowerCaseMessage.includes("remove all values for december")) {
    // Action 3: Find the December row and clear Income, Costs, and Net Income values

    var lastRow = sheet.getLastRow();
    var decemberRow = -1; // Variable to store the row number of December

    if (lastRow > 1) {
      // Get all values from the first column (Month) starting from row 2
      var monthValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

      // Loop through the month values to find December
      for (var i = 0; i < monthValues.length; i++) {
        if (monthValues[i][0].toString().toLowerCase() === "december") {
          decemberRow = i + 2; // +2 because array is 0-indexed and sheet is 1-indexed, starting check from row 2
          break; // Found December, exit loop
        }
      }

      if (decemberRow !== -1) {
        // Clear the values in columns B, C, and D for the December row
        sheet.getRange(decemberRow, 2, 1, 3).clearContent();
        response = "Okay, I've removed the values for December.";
      } else {
        response = "I couldn't find a row for December.";
      }
    } else {
       response = "The sheet is empty. I can't remove values for December yet.";
    }

  } else {
    // Default response for unrecognized commands
    response = "I understand '" + message + "', but for this demo I can only 'make a budgeting app', 'include decimals', or 'remove all values for December'.";
  }

  // --- End Hardcoded Demo Logic ---

  // Return the response message back to the sidebar client-side script
  return response;
}