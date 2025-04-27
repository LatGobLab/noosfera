import React from "react";
import { View } from "react-native";
import { PostList } from "@/src/components/ReporteCard/PostList";

export default function Home() {
  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <PostList />
    </View>
  );
}
