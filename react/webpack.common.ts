import * as path from 'path';
import * as fs from 'fs';
import { Configuration } from 'webpack';

const blocksSrcPath = path.resolve(import.meta.dirname, 'src/blocks');
const blocks = fs.readdirSync(blocksSrcPath, { withFileTypes: true }).filter((dirent) => dirent.isDirectory());

const configuration: Configuration = {
  entry: {
    ...blocks
      .map((block) => ({
        [`blocks:${block.name}`]: {
          filename: `blocks/${block.name}/${block.name}.js`,
          import: path.resolve(blocksSrcPath, block.name, `${block.name}.tsx`),
          dependOn: ['bundle'],
          library: {
            type: 'module',
          },
        },
      }))
      .reduce((blocks, block) => ({ ...blocks, ...block }), {}),
    delayed: {
      filename: 'scripts/delayed.js',
      import: ['../scripts/_delayed.js'],
      dependOn: ['bundle'],
      library: {
        type: 'module',
      },
    },
    scripts: {
      filename: 'scripts/scripts.js',
      import: ['../scripts/_scripts.js'],
      dependOn: ['bundle'],
      library: {
        type: 'module',
      },
    },
    bundle: {
      filename: 'scripts/bundle.js',
      import: ['../scripts/aem.js'],
      library: {
        type: 'module',
      },
    },
  },

  experiments: {
    outputModule: true,
  },

  output: {
    path: path.resolve(import.meta.dirname, '..'),
    publicPath: '/',
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        bundle: {
          test: /[\\/]node_modules[\\/]|aem\.js$/,
          chunks: 'all',
          name: 'bundle',
          enforce: true,
        },
      },
    },
  },

  resolve: {
    alias: {
      'react/jsx-runtime': 'preact/jsx-runtime',
      'react/jsx-dev-runtime': 'preact/jsx-runtime',
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat', // Must be below test-utils

      '@': path.resolve(import.meta.dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.mts', '.ts', '.tsx'],
    plugins: [],
  },

  module: {
    rules: [
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
  },
  plugins: [],
  target: ['es2022'],
};

export default configuration;
