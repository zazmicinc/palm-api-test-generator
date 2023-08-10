const vscode = require("vscode");
const FileUtils = require("./utils/FileUtils");
const TestsGenerator = require("./utils/TestsGenerator");

async function generateUnitTestsFromFile(fileName, selectedText, testFramework) {
  const generatedTests = await TestsGenerator.generateUnitTest(selectedText, testFramework);
  if (generatedTests === undefined) {
    return;
  }
  FileUtils.createTestFile(fileName, generatedTests);
}

async function generateUnitTestsFromEditor(testFramework) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);
  const fileName = editor.document.fileName;

  await generateUnitTestsFromFile(fileName, selectedText, testFramework);
}

function activate(context) {
  const disposable = vscode.commands.registerCommand("palm-api-test-generator.GenerateUnitTest", async () => {
    let testFramework = context.workspaceState.get("palm-api-test-generator.testFramework");
    
    testFramework = await vscode.window.showInputBox({
      prompt: "Enter the testing framework (optional)",
      placeHolder: "e.g., Jest, Chai, Mocha, TestNG...",
      value: testFramework,
    });

    context.workspaceState.update("palm-api-test-generator.testFramework", testFramework);

    if (!testFramework || testFramework === "") {
      testFramework = "the most appropriate framework";
    }

    return new Promise((resolve) => {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Generating Unit Tests...",
          cancellable: true,
        },
        async (progress, token) => {
          await generateUnitTestsFromEditor(testFramework);
          resolve();
        }
      );
    });
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
