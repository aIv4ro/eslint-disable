import { EslintFile } from "./types/eslint-file"
import { EslintFileEditor } from "./types/eslint-file-editor"
import * as vscode from 'vscode'

export class EslintFileEditorJs implements EslintFileEditor {
  async supressRule({ rule, file }: { rule: string; file: EslintFile; }): Promise<void> {
    const module = await require(file.path)
    module.rules ??= {}
    module.rules[rule] = 0
    const text = `module.exports = ${JSON.stringify(module, null, 2)}` 
    await vscode.workspace.fs.writeFile(file.uri, Buffer.from(text))
    const doc = await vscode.workspace.openTextDocument(file.uri)
    await vscode.window.showTextDocument(doc)
    try {
      await vscode.commands.executeCommand('eslint.executeAutofix')
    } catch (error) {
      await vscode.window.showErrorMessage('Failed to execute eslint autofixer. Please check the eslint config file format.')
    }
  }
}