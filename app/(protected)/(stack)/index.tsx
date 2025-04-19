import { Redirect } from "expo-router";

export default function StackIndex() {
  // Redirect to the tabs when accessing the stack index directly
  return <Redirect href="/(protected)/(tabs)" />;
}
