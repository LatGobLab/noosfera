export default {
  expo: {
    name: "noosfera",
    slug: "noosfera",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "com.latgoblab.noosfera",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.latgoblab.noosfera",
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "Necesitamos acceso a tu ubicación para mejorar tu experiencia en la aplicación",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "Necesitamos acceso a tu ubicación para mejorar tu experiencia en la aplicación",
      },
    },
    android: {
      package: "com.latgoblab.noosfera",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      softwareKeyboardLayoutMode: "pan",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone",
          recordAudioAndroid: true,
        },
      ],
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/noosferaBlack.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/images/noosferaWhite.png",
            backgroundColor: "#0d0f15",
          },
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Permitir a Noosfera usar tu ubicación para mejorar tu experiencia.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "6b45047f-0e6c-4d84-8942-f4623140ad27",
      },
    },
  },
};
