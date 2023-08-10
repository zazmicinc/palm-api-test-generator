const vscode = require("vscode");
const fs = require("fs");
const path = require('path');


function createTestFile(name, content) {
  const wsedit = new vscode.WorkspaceEdit();
  const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
  const pathInfo = path.parse(name);
  
  const filePath = vscode.Uri.file(wsPath + `/${pathInfo.name}.test${pathInfo.ext}`);
  wsedit.createFile(filePath, { ignoreIfExists: true });
  
  vscode.workspace.applyEdit(wsedit);
  vscode.window.showInformationMessage(
    "Created a new " + filePath.toString()
  );

  try {
    fs.writeFileSync(filePath.fsPath, content, { flag: "w" });
  } catch (error) {
    vscode.window.showErrorMessage("Error writing to file: " + error.message);
  }
}

module.exports = {
  createTestFile,
};
