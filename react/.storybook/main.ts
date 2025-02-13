import type { StorybookConfig } from '@storybook/react-webpack5';
import * as path from 'node:path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-onboarding',
    '@storybook/addon-webpack5-compiler-babel',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        // ...config.resolve.alias,
        ...{
          'react/jsx-runtime': 'preact/jsx-runtime',
          'react/jsx-dev-runtime': 'preact/jsx-runtime',
          react: 'preact/compat',
          'react-dom/test-utils': 'preact/test-utils',
          'react-dom': 'preact/compat',
          '@': path.resolve(__dirname, '../src'),
        },
      };
      config.resolve.extensions = [...config.resolve.extensions, ...['.mjs', '.js', '.jsx', '.mts', '.ts', '.tsx']];
    }
    if (config.module) {
      config.module.rules = [
        ...(config.module.rules || []),
        ...[
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader',
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.s[ac]ss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
          },
        ],
      ];
    }

    return config;
  },
};

export default config;
