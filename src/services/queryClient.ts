import { QueryClient, onlineManager, focusManager } from '@tanstack/react-query';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as Network from 'expo-network';

// Configure the online manager for React Query
onlineManager.setEventListener(setOnline => {
  const subscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });

  return () => {
    subscription.remove();
  };
});

// Configure the focus manager for React Query
if (Platform.OS !== 'web') {
  focusManager.setEventListener(handleFocus => {
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      handleFocus(status === 'active');
    });
    
    return () => subscription.remove();
  });
}

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });

export default queryClient;