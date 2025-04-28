import React, { createContext, useContext } from "react";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  SharedValue,
  ScrollHandlerProcessed,
  withTiming,
} from "react-native-reanimated";

// Define la altura estándar del header
const HEADER_HEIGHT = 56;

interface HeaderVisibilityContextType {
  scrollY: SharedValue<number>; // Valor compartido para la posición Y del scroll
  headerHeight: SharedValue<number>; // Valor compartido para la altura (puede ser útil si cambia)
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>; // El manejador de scroll para conectar a la lista/scrollview
  headerTranslateY: SharedValue<number>;
}

const HeaderVisibilityContext = createContext<
  HeaderVisibilityContextType | undefined
>(undefined);

export function HeaderVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Valor compartido para la posición del scroll
  const scrollY = useSharedValue(0);
  // Valor compartido para la altura del header (podría ser estático si no cambia)
  const headerHeight = useSharedValue(HEADER_HEIGHT);
  // Nuevo: Valor compartido para la posición Y anterior del scroll
  const prevScrollY = useSharedValue(0);
  // Nuevo: Valor compartido para la traslación Y del header
  const headerTranslateY = useSharedValue(0);

  // Hook que crea un manejador de eventos de scroll optimizado
  // Se ejecutará en el hilo de UI para mayor fluidez
  const scrollHandler = useAnimatedScrollHandler({
    // La función onScroll se llama cada vez que ocurre un evento de scroll
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      // Actualiza el valor compartido 'scrollY' con la posición Y actual del scroll
      // Esto se hace directamente en el hilo de UI, evitando pasar por el hilo de JS
      scrollY.value = currentY;

      // Calcular diferencia con la posición anterior
      const diff = currentY - prevScrollY.value;

      // Solo reaccionar si el scroll es significativo (evitar micro-movimientos)
      // y si no estamos en la parte superior (para evitar ocultar al rebotar arriba)
      if (Math.abs(diff) > 1 && currentY >= 0) {
        // Si scroll hacia abajo Y más allá de la altura del header
        if (diff > 0 && currentY > headerHeight.value) {
          // Ocultar header animado
          headerTranslateY.value = withTiming(-headerHeight.value, {
            duration: 250,
          });
        }
        // Si scroll hacia arriba
        else if (diff < 0) {
          // Mostrar header animado
          headerTranslateY.value = withTiming(0, { duration: 250 });
        }
      }

      // Actualizar la posición anterior para la próxima comparación
      prevScrollY.value = currentY;
    },
  });

  // Provee los valores compartidos y el manejador de scroll a los componentes hijos
  return (
    <HeaderVisibilityContext.Provider
      value={{ scrollY, headerHeight, scrollHandler, headerTranslateY }}
    >
      {children}
    </HeaderVisibilityContext.Provider>
  );
}

// Hook personalizado para acceder fácilmente al contexto
export function useHeaderVisibility() {
  const context = useContext(HeaderVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useHeaderVisibility debe usarse dentro de un HeaderVisibilityProvider"
    );
  }
  return context;
}
