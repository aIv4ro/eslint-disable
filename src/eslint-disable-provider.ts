import * as vscode from 'vscode'
import { findEslintFile, getEslintFileEditor } from './utils'

type TextDoc = vscode.TextDocument
type Range = vscode.Range
type Selection = vscode.Selection

export class EslintDisableProvider implements vscode.CodeActionProvider<vscode.CodeAction> {
  static commandId = 'eslint-disable.disable'
  private command!: vscode.Disposable

  activate (context: vscode.ExtensionContext) {
    this.command = vscode.commands.registerCommand(EslintDisableProvider.commandId, this.run, this)
    context.subscriptions.push(this.command)
    vscode.languages.registerCodeActionsProvider({ pattern: '**/*.{ts,js,tsx,jsx}' }, this, {providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]})
  }

  provideCodeActions(_: TextDoc, __: Range | Selection, context: vscode.CodeActionContext): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    return context.diagnostics
      .filter(diagnostic => diagnostic.source === 'eslint')
      .map<vscode.CodeAction | vscode.Command>(diagnostic => {
        const ruleId = typeof diagnostic.code === 'object' ? String(diagnostic.code.value) : String(diagnostic.code)
        const action = new vscode.CodeAction(`Disable eslint rule (${ruleId})`, vscode.CodeActionKind.QuickFix)
        action.command = {
          title: action.title,
          command: EslintDisableProvider.commandId,
          arguments: [ruleId]
        }
        return action
      })
  }

  private async run (ruleId: string) {
    const configFile = await findEslintFile()
    if (configFile == null) {
      vscode.window.showErrorMessage('Eslint config file not found. Please make sure you have a .eslintrc file in your workspace.')
      return
    }

    const eslintFileEditor = getEslintFileEditor(configFile)
    if (eslintFileEditor == null) {
      vscode.window.showErrorMessage('Eslint file extension not supported. Please use .json or some supported js extension.')
      return
    }

    await eslintFileEditor.supressRule({ rule: ruleId, file: configFile })
  }
}
