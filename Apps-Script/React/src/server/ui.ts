export function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Vibe Sheet')
    .addItem('Open Vibe Sheet Sidebar', 'showMySidebar')
    .addToUi();
}

export function showMySidebar() {
  const html =
    HtmlService.createHtmlOutputFromFile('sidebar').setTitle('Vibe Sheet');
  SpreadsheetApp.getUi().showSidebar(html);
}
