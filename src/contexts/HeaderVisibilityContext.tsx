import React, { createContext, useContext, useState, useRef } from "react";

interface HeaderVisibilityContextType {
  isHeaderVisible: boolean;
  setHeaderVisible: (visible: boolean) => void;
  handleScroll: (offsetY: number) => void;
}

const HeaderVisibilityContext = createContext<
  HeaderVisibilityContextType | undefined
>(undefined);

export function HeaderVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollThresholdUp = 15; // Menos sensible para mostrar
  const scrollThresholdDown = 20; // Más sensible para ocultar
  const velocityThreshold = 2; // Umbral de velocidad mínima

  // Esta función maneja el scroll y calcula la velocidad
  const handleScroll = (offsetY: number) => {
    const now = Date.now();
    const timeDelta = now - lastScrollTime.current;
    const distance = offsetY - lastScrollY.current;

    // Calculamos velocidad en pixeles/ms
    if (timeDelta > 0) {
      scrollVelocity.current = Math.abs(distance / timeDelta);
    }

    // Si estamos scrolleando hacia arriba y la posición es menor que el umbral, mostramos el header
    if (
      distance < -scrollThresholdUp &&
      scrollVelocity.current > velocityThreshold
    ) {
      setHeaderVisible(true);
    }
    // Si estamos scrolleando hacia abajo, ya pasamos el umbral inicial, y tenemos suficiente velocidad
    else if (
      distance > scrollThresholdDown &&
      offsetY > 50 &&
      scrollVelocity.current > velocityThreshold
    ) {
      setHeaderVisible(false);
    }

    // Actualizamos los valores para el próximo cálculo
    lastScrollTime.current = now;
    lastScrollY.current = offsetY;
  };

  return (
    <HeaderVisibilityContext.Provider
      value={{ isHeaderVisible, setHeaderVisible, handleScroll }}
    >
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
