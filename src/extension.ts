// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  const newMeet = [
    {
      label: "Google Meet",
      detail: "Start a new Google Meet",
      link: "https://meet.google.com/new?hs=180&authuser=0",
    },
  ];
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "meet.startMeet",
    async function () {
      const meet = await vscode.window.showQuickPick(newMeet, {
        matchOnDetail: true,
      });

      if (meet) {
        await vscode.env.openExternal(vscode.Uri.parse(meet.link));
      }
    }
  );

  context.subscriptions.push(disposable);
  const provider = new GoogleMeetView(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(GoogleMeetView.viewType, provider)
  );
}

class GoogleMeetView implements vscode.WebviewViewProvider {
  public static readonly viewType = "meet.meetView";
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "src", "extension.css")
    );

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<meta
          http-equiv="Content-Security-Policy"
          content="default-src 'none'; img-src ${webview.cspSource} https:; script-src ${webview.cspSource}; style-src ${webview.cspSource};"
        />

				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleMainUri}" rel="stylesheet">
				<title>Google Meet</title>
			</head>
			<body>
				<a class="meet-link" href="https://meet.google.com/new?hs=180&authuser=0"><button  class="add-color-button">Start New Google Meet</button></a>
			</body>
			</html>`;
  }
}
