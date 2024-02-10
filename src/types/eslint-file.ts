import * as vscode from 'vscode';

export interface EslintFile {
  uri: vscode.Uri;
  path: string;
  extension: string;
}
