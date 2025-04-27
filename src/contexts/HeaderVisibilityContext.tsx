import React, { createContext, useContext } from "react";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

interface HeaderVisibilityContextType {
  scrollY: SharedValue<number>;
  headerHeight: number; // Keep track of header height for calculations
  // We might expose derived values later if needed
}

const HeaderVisibilityContext = createContext<
  HeaderVisibilityContextType | undefined
>(undefined);

const DEFAULT_HEADER_HEIGHT = 56; // Default header height

export function HeaderVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Shared value to store the current scroll position
  const scrollY = useSharedValue(0);
  const headerHeight = DEFAULT_HEADER_HEIGHT; // Or make this dynamic if needed

  // Note: The scroll handler itself will be defined in the screen component
  // where the ScrollView/FlatList exists, as it needs access to the scroll events.
  // This context primarily holds the shared scrollY value.

  return (
    <HeaderVisibilityContext.Provider value={{ scrollY, headerHeight }}>
      {children}
    </HeaderVisibilityContext.Provider>
  );
}

export function useHeaderVisibility() {
  const context = useContext(HeaderVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useHeaderVisibility must be used within a HeaderVisibilityProvider"
    );
  }
  return context;
}

// Helper hook to create the scroll handler in the screen component
export function useHeaderScrollHandler() {
  const { scrollY } = useHeaderVisibility();
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  return scrollHandler;
}
