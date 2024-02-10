import * as vscode from 'vscode';
import { EslintDisableProvider } from './eslint-disable-provider';

export async function activate(context: vscode.ExtensionContext) {
	const eslint = vscode.extensions.getExtension('dbaeumer.vscode-eslint');
  if (eslint === undefined) {
    throw new Error('ESLint extension not found');
  }
  !eslint.isActive && await eslint.activate();
  const eslintDisableProvider = new EslintDisableProvider();
  eslintDisableProvider.activate(context);
}

export function deactivate() {}
