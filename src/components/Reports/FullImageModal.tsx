import React from "react";
import { View, TouchableOpacity, Text, Dimensions, Modal } from "react-native";
import { Image } from "expo-image";

type FullImageModalProps = {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
};

export const FullImageModal = ({
  visible,
  imageUri,
  onClose,
}: FullImageModalProps) => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/90 justify-center items-center">
        <TouchableOpacity
          className="absolute top-10 right-6 z-10"
          onPress={onClose}
        >
          <Text className="text-white text-xl">✕</Text>
        </TouchableOpacity>

        <Image
          source={{ uri: imageUri || "" }}
          style={{
            width: screenWidth,
            height: screenWidth * 1.3,
          }}
          contentFit="contain"
        />
      </View>
    </Modal>
  );
};
