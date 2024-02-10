import { EslintFile } from "./eslint-file"

export interface EslintFileEditor {
  supressRule ({
    rule,
    file
  }: {
    rule: string;
    file: EslintFile
  }): Promise<void>;
}