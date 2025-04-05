import { Tabs } from "expo-router";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function ProtectedLayout() {
  const session = useAuthStore((state) => state.session);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/welcome");
    }
  }, [session]);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Index",
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
