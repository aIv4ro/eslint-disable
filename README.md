# eslint-disable README

This is a simple extension that allows you to disable globally a eslint rule, modifying the `.eslintrc` file.
Is useful at the start of a project, when you want to disable some rules that are not useful for you, but
is not recommended abusse of this practice.

## Requirements

It requires the `eslint` package installed in your project because it uses the `eslint` code actions to generate the disable action.

## Known Issues

- I have experimented some issues with js extension if type module is enabled in the `package.json` file.

## Release Notes

### 0.0.1
- add .eslintrc.json extension support

### 0.0.2
- show code action in quick fixes group

### 0.0.3
- add .eslintrc.js extension support
- add .eslintrc.cjs extension support