import * as vscode from 'vscode'
import path from 'node:path'
import { EslintFile } from './types/eslint-file'
import { EslintFileEditor } from './types/eslint-file-editor'
import { EslintFileEditorJson } from './eslint-file-editor-json'
import { EslintFileEditorJs } from './eslint-file-editor-js'

export async function findEslintFile (): Promise<EslintFile | null> {
  const [firstUri] = await vscode.workspace.findFiles('.eslintrc.{js,cjs,json}')
  // eslint-disable-next-line eqeqeq
  if (firstUri == null) {
    return null
  }
  const filePath = firstUri.fsPath
  const fileExtension = path.extname(filePath)
  return {
    uri: firstUri,
    path: filePath,
    extension: fileExtension
  }
} 

const javascriptExtensions = ['.js', '.cjs']

export function getEslintFileEditor (file: EslintFile): EslintFileEditor | null {
  const {extension} = file
  if (extension === '.json') {
    return new EslintFileEditorJson()
  }
  if (javascriptExtensions.includes(extension)) {
    return new EslintFileEditorJs()
  }
  return null
}