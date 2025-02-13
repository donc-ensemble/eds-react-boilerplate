export default (api) => ({
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        useBuiltIns: true,
        useSpread: true,
        development: api.env('development'),
      },
    ],
    ['@babel/preset-typescript', {}],
  ],
  plugins: [],
});
