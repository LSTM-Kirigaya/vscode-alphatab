import * as vscode from 'vscode';
import { keywordDefault, keywords } from './tab-keywords';

class AlphatabKeywordCompletionItemProvider implements vscode.CompletionItemProvider {
    public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[]> {
        const clItems: vscode.CompletionItem[] = [];
        for (const keyword of keywords) {
            const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
            item.detail = keyword;
            if (keyword.includes('$')) {
                item.insertText = new vscode.SnippetString(keyword);
            }
            clItems.push(item);
        }
        return clItems;
    }
}

export const alphatabKeywordCompletionItemProvider = new AlphatabKeywordCompletionItemProvider();