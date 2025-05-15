import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Pressable,
  ActivityIndicator,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useAddComment } from "@/src/hooks/useAddComment";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { useToast } from "@/src/contexts/ToastContext";

type CommentInputProps = {
  reportId: number;
  onCommentAdded?: () => void;
};

export const CommentInput = ({
  reportId,
  onCommentAdded,
}: CommentInputProps) => {
  const [commentText, setCommentText] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { profile } = useUserProfile();
  const { mutate: addComment, isPending: isSubmitting } = useAddComment();
  const { showToast } = useToast();

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSubmit = useCallback(() => {
    if (!commentText.trim()) return;
    addComment(
      {
        reportId: reportId,
        userId: profile?.id || "",
        content: commentText.trim(),
        parentId: null,
      },
      {
        onSuccess: () => {
          setCommentText("");
          showToast("Comentario agregado correctamente", "success");
          if (onCommentAdded) {
            onCommentAdded();
          }
        },
        onError: (error) => {
          console.error("Error al agregar comentario:", error);
          showToast(
            "No se pudo agregar el comentario. Inténtalo de nuevo.",
            "error"
          );
        },
      }
    );
  }, [commentText, profile, reportId, addComment, onCommentAdded]);

  // Extra padding based on keyboard visibility
  const extraPadding = isKeyboardVisible
    ? Platform.OS === "ios"
      ? "pb-8"
      : "pb-6"
    : "";

  return (
    <View
      className={`flex-row items-center p-3 border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${extraPadding}`}
    >
      <BottomSheetTextInput
        value={commentText}
        onChangeText={setCommentText}
        placeholder="Agregar un comentario..."
        placeholderTextColor="#9ca3af"
        className="flex-1 px-3 py-2 mr-2 text-base rounded-full bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        multiline={true}
        onSubmitEditing={handleSubmit}
        autoCorrect={true}
      />
      <Pressable
        onPress={handleSubmit}
        disabled={commentText.trim().length === 0 || isSubmitting}
        className={`h-10 w-10 rounded-full items-center justify-center ${
          commentText.trim().length > 0 && !isSubmitting
            ? "bg-blue-500 dark:bg-blue-600"
            : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Ionicons
            name="send"
            size={18}
            color={commentText.trim().length > 0 ? "white" : "#9ca3af"}
          />
        )}
      </Pressable>
    </View>
  );
};
