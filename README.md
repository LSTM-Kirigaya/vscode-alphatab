# Alphatab

![](https://img.shields.io/badge/typescript-blue)
![](https://img.shields.io/badge/alphatab.js-org)

This is a vscode extension impl of the [AlphaTab](https://alphatab.net/). With alpha tex, a format for guitar tab, you can write and render your guitar tab just in vscode.

## quick start

open vscode, create `<name>.alphatab` and write alphatex, click `open preview` in top right corner of your editor and review the score in webview.

![](./figure/output.gif)

## write and render

Once open the preview, you can write the alphatex, and webview will receive the change debouncively and rerender the score.