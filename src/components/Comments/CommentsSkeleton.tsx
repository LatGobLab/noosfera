import React from "react";
import { View, Dimensions } from "react-native";

interface CommentsSkeletonProps {
  isDark: boolean;
  itemCount?: number;
}

const SkeletonItem = ({ isDark }: { isDark: boolean }) => (
  <View className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
    <View className="flex-row">
      {/* Avatar skeleton */}
      <View
        className={`w-10 h-10 rounded-full mr-3 ${
          isDark ? "bg-gray-700" : "bg-gray-200"
        }`}
        style={{ opacity: 0.7 }}
      />

      {/* Content skeleton */}
      <View className="flex-1">
        {/* Username skeleton */}
        <View
          className={`h-4 rounded mb-2 ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
          style={{ width: "30%", opacity: 0.7 }}
        />

        {/* Comment text skeleton - multiple lines */}
        <View
          className={`h-3 rounded mb-1 ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
          style={{ width: "90%", opacity: 0.5 }}
        />
        <View
          className={`h-3 rounded mb-1 ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
          style={{ width: "75%", opacity: 0.5 }}
        />
        <View
          className={`h-3 rounded mb-3 ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
          style={{ width: "45%", opacity: 0.5 }}
        />

        {/* Actions row skeleton */}
        <View className="flex-row gap-5">
          <View
            className={`h-3 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
            style={{ width: 60, opacity: 0.4 }}
          />
          <View
            className={`h-3 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
            style={{ width: 40, opacity: 0.4 }}
          />
          <View
            className={`h-3 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
            style={{ width: 50, opacity: 0.4 }}
          />
        </View>
      </View>

      {/* Like button skeleton */}
      <View className="items-center justify-center ml-2">
        <View
          className={`w-6 h-6 rounded ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
          style={{ opacity: 0.4 }}
        />
        <View
          className={`h-3 rounded mt-2 ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
          style={{ width: 20, opacity: 0.4 }}
        />
      </View>
    </View>
  </View>
);

export const CommentsSkeleton = ({
  isDark,
  itemCount = 5,
}: CommentsSkeletonProps) => {
  const screenHeight = Dimensions.get("window").height;

  return (
    <View
      className="flex-1"
      style={{
        height: screenHeight * 0.82, // Same height as CommentsList
        minHeight: screenHeight * 0.5, // Ensure minimum height
      }}
    >
      {Array.from({ length: itemCount }, (_, index) => (
        <SkeletonItem key={index} isDark={isDark} />
      ))}
      {/* Fill remaining space to maintain consistent height */}
      <View className="flex-1" />
    </View>
  );
};
