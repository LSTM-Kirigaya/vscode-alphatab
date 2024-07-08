import * as vscode from 'vscode';
import * as provider from './provider';
import { openAlphatabPreview } from './webview';

function registerLSP(context: vscode.ExtensionContext) {
    const alphatabSelector: vscode.DocumentSelector = {scheme: 'file', language: 'alphatab'};
    vscode.languages.registerCompletionItemProvider(alphatabSelector, provider.alphatabKeywordCompletionItemProvider, '\\');
}

function registerWebview(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand('alphatab.preview', () => {
        openAlphatabPreview(context)
    });
}

export function activate(context: vscode.ExtensionContext) {
    registerLSP(context);
    registerWebview(context);
    console.log('alphatab start');
}

export function deactivate() {}
