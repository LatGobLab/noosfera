import * as SecureStore from 'expo-secure-store';

export const saveToken = async (value: string): Promise<void> => {
  try{
    await SecureStore.setItemAsync("jwt", value);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

export const getStoredToken = async () => {
    try {
      return await SecureStore.getItemAsync('jwt');
    } catch (error) {
      console.error('Failed to get stored token:', error);
      return null;
    }
  };



  export const clearTokens = async () => {
    try {
      await SecureStore.deleteItemAsync('jwt');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  };