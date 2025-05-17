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
      let permissionJustGranted = false;
      
      if (status !== 'granted') {
        const result = await Location.requestForegroundPermissionsAsync();
        status = result.status;
        if (status !== 'granted') {
          set({ errorMsg: 'Permiso de ubicación denegado', isLoading: false });
          return;
        }
        permissionJustGranted = true;
      }
      
      // Primero intentar obtener la última posición conocida (mucho más rápido)
      let location = await Location.getLastKnownPositionAsync();
      
      if (location) {
        // Si hay una ubicación conocida, actualizamos inmediatamente
        set({ 
          latitude: location.coords.latitude, 
          longitude: location.coords.longitude,
          errorMsg: null,
          isLoading: false 
        });
      } else {
        // Si el permiso acaba de ser concedido o no hay ubicación conocida
        // usar un timeout más largo y hacer reintentos
        const getLocationWithRetry = async (retries = 2, timeout = permissionJustGranted ? 15000 : 5000) => {
          const locationPromise = Location.getCurrentPositionAsync({
            accuracy: permissionJustGranted ? Location.Accuracy.Balanced : Location.Accuracy.Lowest,
          });
          
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout obteniendo ubicación')), timeout);
          });
          
          try {
            const result = await Promise.race([locationPromise, timeoutPromise]) as Location.LocationObject;
            return result;
          } catch (error) {
            if (retries > 0) {
              console.log(`Reintentando obtener ubicación. Intentos restantes: ${retries}`);
              return getLocationWithRetry(retries - 1, timeout);
            }
            throw error;
          }
        };
        
        try {
          location = await getLocationWithRetry();
          set({ 
            latitude: location.coords.latitude, 
            longitude: location.coords.longitude,
            errorMsg: null,
            isLoading: false
          });
        } catch (timeoutError) {
          console.warn('No se pudo obtener la ubicación después de múltiples intentos');
          set({ errorMsg: 'No se pudo obtener la ubicación. Intente nuevamente.', isLoading: false });
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