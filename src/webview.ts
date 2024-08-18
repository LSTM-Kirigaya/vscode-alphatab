import * as fspath from 'path';
import * as fs from 'fs';

import * as vscode from 'vscode';

function getWebviewContent(extensionPath: string, panel?: vscode.WebviewPanel): string {
    // 找到你的 index.html 所在文件夹的绝对路径
    const htmlRoot = fspath.join(extensionPath, 'webview');
    const htmlIndexPath = fspath.join(htmlRoot, 'alphatab.html');
    const html = fs.readFileSync(htmlIndexPath, 'utf-8').replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        const absLocalPath = fspath.resolve(htmlRoot, $2);
        // this.panel 就是你创建的 webview 对象
        const webviewUri = panel?.webview.asWebviewUri(vscode.Uri.file(absLocalPath));
        const replaceHref = $1 + webviewUri?.toString() + '"';
        return replaceHref;
    });
    return html;
}

function getSoundFileUri(context: vscode.ExtensionContext, soundFile: string, panel?: vscode.WebviewPanel) {
    const soundFilePath = fspath.join(context.extensionPath, 'webview', 'sound', soundFile);
    return panel?.webview.asWebviewUri(vscode.Uri.file(soundFilePath)).toString();
}

function getSoundDirUri(context: vscode.ExtensionContext, panel?: vscode.WebviewPanel) {
    const soundFilePath = fspath.join(context.extensionPath, 'webview', 'sound');
    return panel?.webview.asWebviewUri(vscode.Uri.file(soundFilePath)).toString();
}

export function openAlphatabPreview(context: vscode.ExtensionContext, uri?: vscode.Uri) {    
    const panel = vscode.window.createWebviewPanel(
        'alphatab',
        'Alphatab',
        vscode.ViewColumn.Two,
        {
            enableScripts: true,
            enableCommandUris: true,
            enableFindWidget: true,
            enableForms: true
        }
    );
    
    const iconPath = fspath.join(context.extensionPath, 'icon', 'guitar.dark.svg');
    
    panel.iconPath = vscode.Uri.file(iconPath);
    const html = getWebviewContent(context.extensionPath, panel);
    panel.webview.html = html;

    const setting = {
        staveProfile: 'default',
        core: {
            tex: true
        },
        notation: { 
            rhythmMode: 'showwithbars',
        },
        player: {
            enablePlayer: true,
            soundFont: ''
        }
    };
    const sf2Dir = getSoundDirUri(context, panel);
    if (uri) {
        const alphatex = fs.readFileSync(uri.fsPath, 'utf-8');        
        debouncePostMessage(panel, { alphatex, setting, sf2Dir });
    }

    vscode.workspace.onDidChangeTextDocument(e => {
        if (e.contentChanges.length > 0) {
            const document = e.document;
            const alphatex = document.getText();
            debouncePostMessage(panel, { alphatex, setting, sf2Dir });
        }
    });
}

let debouncePostMessageHandler: NodeJS.Timeout | undefined = undefined;
function debouncePostMessage(panel: vscode.WebviewPanel, message: any) {
    if (debouncePostMessageHandler !== undefined) {        
        clearTimeout(debouncePostMessageHandler);
    }
    debouncePostMessageHandler = setTimeout(() => {
        panel.webview.postMessage(message);
    }, 100);
}