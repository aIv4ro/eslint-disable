import * as vscode from 'vscode';
import { findEslintFile, getEslintFileEditor } from './utils';

export class EslintDisableProvider implements vscode.CodeActionProvider<vscode.CodeAction> {
  static commandId = 'eslint-disable.disable';
  private command!: vscode.Disposable;

  activate (context: vscode.ExtensionContext) {
    this.command = vscode.commands.registerCommand(EslintDisableProvider.commandId, this.run, this);
    context.subscriptions.push(this.command);
    vscode.languages.registerCodeActionsProvider({ pattern: '**/*.{ts,js,tsx,jsx}' }, this);
  }

  provideCodeActions(document: vscode.TextDocument, _: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    console.log(context.diagnostics);
    const actions = context.diagnostics
      .filter(diagnostic => diagnostic.source === 'eslint')
      .map<vscode.CodeAction | vscode.Command>(diagnostic => {
        const rule = typeof diagnostic.code === 'object' ? diagnostic.code.value : diagnostic.code;
        return {
          title: `Disable eslint rule (${rule})`,
          command: EslintDisableProvider.commandId,
          arguments: [document, diagnostic],
          kind: vscode.CodeActionKind.QuickFix.append('disable.rule')
        };
      });
    return actions;
  }

  private async run (document: vscode.TextDocument, diagnostic: vscode.Diagnostic) {
    const ruleId = typeof diagnostic.code === 'object' ? String(diagnostic.code.value) : String(diagnostic.code);
    const configFile = await findEslintFile();
    if (configFile === null) {
      return;
    }
    const eslintFileEditor = getEslintFileEditor(configFile);
    await eslintFileEditor.supressRule({ rule: ruleId, file: configFile });
  }
}
