const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

const config = getDefaultConfig(__dirname);

// Envuelve primero con NativeWind y luego con Reanimated
const configWithNativeWind = withNativeWind(config, { input: "./global.css" });
module.exports = wrapWithReanimatedMetroConfig(configWithNativeWind);
