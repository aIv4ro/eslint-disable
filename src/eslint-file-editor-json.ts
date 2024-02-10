import { readFile, writeFile } from "node:fs/promises"
import { EslintFile } from "./types/eslint-file"
import { EslintFileEditor } from "./types/eslint-file-editor"
import vscode from 'vscode'

export class EslintFileEditorJson implements EslintFileEditor {
  async supressRule ({ rule, file }: { rule: string; file: EslintFile }): Promise<void> {
    console.log(`Supressing rule ${rule} in ${file.path}`)
    const obj = await readFile(file.path).then(res => JSON.parse(res.toString()))
    obj.rules ??= {}
    obj.rules[rule] = 0
    const textEditorConfig = vscode.workspace.getConfiguration('editor')
    const tabSize = Number(textEditorConfig.get('tabSize') ?? 2)
    await writeFile(file.path, JSON.stringify(obj, null, tabSize))
  }
}