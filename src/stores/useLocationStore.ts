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
      
      // Primero intentar obtener la última posición conocida (mucho más rápido)
      let location = await Location.getLastKnownPositionAsync();
      
      if (location) {
        // Si hay una ubicación conocida, actualizamos inmediatamente
        set({ 
          latitude: location.coords.latitude, 
          longitude: location.coords.longitude,
          isLoading: false 
        });
      } else {
        // Si no hay ubicación conocida, usar getCurrentPosition con un timeout
        const locationPromise = Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest, // Usar la precisión más baja para mayor velocidad
        });
        
        // Establecer un timeout de 5 segundos para no esperar demasiado
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout obteniendo ubicación')), 5000);
        });
        
        try {
          location = await Promise.race([locationPromise, timeoutPromise]) as Location.LocationObject;
          set({ 
            latitude: location.coords.latitude, 
            longitude: location.coords.longitude,
            errorMsg: null,
            isLoading: false
          });
        } catch (timeoutError) {
          console.warn('Timeout al obtener ubicación precisa');
          // Si ya tenemos una ubicación anterior, mantenemos esa
          if (!location) {
            set({ errorMsg: 'Tiempo de espera agotado', isLoading: false });
          }
        }
      }
    } catch (error) {
      set({ 
        errorMsg: 'Error al obtener la ubicación', 
        isLoading: false 
      });
      console.error('Error obteniendo ubicación:', error);
    }
  },
})); 