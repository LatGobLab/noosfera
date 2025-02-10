import { Pressable, View } from "react-native";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Smartphone } from "~/lib/icons/System";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <View className="flex-row space-x-2">
      {/* Botón para modo claro */}
      <Pressable onPress={() => setColorScheme("light")}>
        {({ pressed }) => (
          <Sun
            className={cn(
              "text-foreground",
              colorScheme === "light" && "text-primary", // Resalta si está activo
              pressed && "opacity-70"
            )}
            size={24}
            strokeWidth={1.25}
          />
        )}
      </Pressable>

      {/* Botón para modo oscuro */}
      <Pressable onPress={() => setColorScheme("dark")}>
        {({ pressed }) => (
          <MoonStar
            className={cn(
              "text-foreground",
              colorScheme === "dark" && "text-primary",
              pressed && "opacity-70"
            )}
            size={23}
            strokeWidth={1.25}
          />
        )}
      </Pressable>

      {/* Botón para modo sistema */}
      <Pressable onPress={() => setColorScheme("system")}>
        {({ pressed }) => (
          <Smartphone
            className={cn(
              "text-foreground",
              colorScheme === "system" && "text-primary",
              pressed && "opacity-70"
            )}
            size={24}
            strokeWidth={1.25}
          />
        )}
      </Pressable>
    </View>
  );
}
