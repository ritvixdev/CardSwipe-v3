module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
    plugins: [
      ["babel-plugin-react-compiler", {
        target: '19'
      }],
      "react-native-reanimated/plugin"  // Keep this last
    ],
  };
};