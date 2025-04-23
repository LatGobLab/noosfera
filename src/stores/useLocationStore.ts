import { create } from 'zustand';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  errorMsg: string | null;
  isLoading: boolean;
  setLocation: (latitude: number, longitude: number) => void;
  setLocationError: (error: string) => void;
  refreshLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  errorMsg: null,
  isLoading: false,
  setLocation: (latitude, longitude) => set({ latitude, longitude }),
  setLocationError: (errorMsg) => set({ errorMsg }),
  refreshLocation: async () => {
    try {
      set({ isLoading: true });
      
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        status = (await Location.requestForegroundPermissionsAsync()).status;
        if (status !== 'granted') {
          set({ errorMsg: 'Permiso de ubicación denegado', isLoading: false });
          return;
        }
      }
      
      // Intentar obtener la última posición conocida primero (más rápido)
      // let location = await Location.getLastKnownPositionAsync();
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // // Si no hay posición conocida, solicitarla
      // if (!location) {

      // }
      
      set({ 
        latitude: location.coords.latitude, 
        longitude: location.coords.longitude,
        errorMsg: null,
        isLoading: false
      });
    } catch (error) {
      set({ 
        errorMsg: 'Error al obtener la ubicación', 
        isLoading: false 
      });
      console.error('Error obteniendo ubicación:', error);
    }
  },
})); 