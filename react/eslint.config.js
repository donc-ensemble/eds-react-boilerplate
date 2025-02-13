//@ts-check

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
// @ts-expect-error no .d.ts available
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default typescriptEslint.config(
  eslint.configs.recommended,
  typescriptEslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  reactPlugin.configs.flat?.recommended ?? {},
  reactPlugin.configs.flat?.['jsx-runtime'] ?? {},
  fixupConfigRules({
    plugins: { 'react-hooks': fixupPluginRules(reactHooksPlugin) },
    rules: reactHooksPlugin.configs.recommended.rules,
  }),
  {
    rules: {
      'react-hooks/exhaustive-deps': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: ['.babelrc.mjs', '.storybook', 'eslint.config.js'],
  },
);
