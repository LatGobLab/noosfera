const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");
/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);
config.resolver.unstable_enablePackageExports = false;

// Envuelve primero con NativeWind y luego con Reanimated
const configWithNativeWind = withNativeWind(config, { input: "./global.css" });
module.exports = wrapWithReanimatedMetroConfig(configWithNativeWind);
