import * as Location from "expo-location";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export async function requestLocationPermission(): Promise<boolean> {
  const {status} =
    await Location.requestForegroundPermissionsAsync();

  return status === Location.PermissionStatus.GRANTED;
}

export async function getCurrentLocation(): Promise<Coordinates> {
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export async function getUserCoordinates(): Promise<Coordinates | null> {
  const granted = await requestLocationPermission();

  if (!granted) {
    return null;
  }

  return getCurrentLocation();
}