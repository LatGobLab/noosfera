import React, { useState, useRef, useEffect } from "react";
import { ScrollView, Image, Dimensions, View } from "react-native";

type PostCardGalleryProps = {
  foto_reporte: any;
  postId: string | number;
};

export const PostCardGallery = ({
  foto_reporte,
  postId,
}: PostCardGalleryProps) => {
  const { width: screenWidth } = Dimensions.get("window");
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>(
    {}
  );
  const BASE_URL = process.env.EXPO_PUBLIC_URL_POST;

  const getImageUrls = (): string[] => {
    try {
      if (typeof foto_reporte === "string") {
        const imageNames = JSON.parse(foto_reporte);
        if (Array.isArray(imageNames) && imageNames.length > 0) {
          return imageNames.map((name: string) => `${BASE_URL}${name}`);
        }
      } else if (Array.isArray(foto_reporte)) {
        if (foto_reporte.length > 0) {
          if (foto_reporte[0]?.url) {
            return foto_reporte.map((item: { url: string }) => item.url);
          }
          return foto_reporte.map((name: string) => `${BASE_URL}${name}`);
        }
      }
      return [];
    } catch (error) {
      console.error("Error parsing image data:", error);
      return [];
    }
  };

  const imageUrls = getImageUrls();

  useEffect(() => {
    setActiveIndex(0);
    const initialLoadState: { [key: number]: boolean } = {};
    for (let i = 0; i < Math.min(3, imageUrls.length); i++) {
      initialLoadState[i] = true;
    }
    setLoadedImages(initialLoadState);

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: false });
    }
  }, [postId, imageUrls.length]);

  if (imageUrls.length === 0) {
    return null;
  }

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);

      const newLoadedImages = { ...loadedImages };

      newLoadedImages[newIndex] = true;

      if (newIndex + 1 < imageUrls.length) {
        newLoadedImages[newIndex + 1] = true;
      }

      if (newIndex - 1 >= 0) {
        newLoadedImages[newIndex - 1] = true;
      }

      setLoadedImages(newLoadedImages);
    }
  };

  return (
    <View className="mb-2">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={screenWidth}
        snapToAlignment="start"
        contentContainerStyle={{ flexGrow: 0 }}
        key={`gallery-${postId}`}
        nestedScrollEnabled={true}
        removeClippedSubviews={true}
      >
        {imageUrls.map((url: string, index: number) => {
          if (!loadedImages[index]) {
            return (
              <View
                key={`placeholder-${index}-${postId}`}
                style={{
                  width: screenWidth,
                  height: 600,
                  backgroundColor: "#e1e1e1",
                }}
              />
            );
          }

          return (
            <Image
              key={`image-${index}-${postId}`}
              source={{ uri: url }}
              style={{
                width: screenWidth,
                height: 600,
              }}
              resizeMode="cover"
              fadeDuration={0}
            />
          );
        })}
      </ScrollView>

      {imageUrls.length > 1 && (
        <View className="flex-row justify-center mt-2">
          {imageUrls.map((_, index) => (
            <View
              key={`indicator-${index}-${postId}`}
              className={`h-1.5 w-1.5 rounded-full mx-1 ${
                activeIndex === index
                  ? "bg-background-dark dark:bg-white"
                  : "bg-slate-300 dark:bg-gray-700"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
};
