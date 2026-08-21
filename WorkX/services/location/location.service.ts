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

export async function getCurrentAddress(): Promise<string | null> {
  const coordinates = await getUserCoordinates();
  if (!coordinates) return null;

  const [address] = await Location.reverseGeocodeAsync(coordinates);
  if (!address) return null;

  return [address.district, address.city, address.region]
    .filter((value): value is string => Boolean(value))
    .filter((value, index, values) => values.indexOf(value) === index)
    .slice(0, 2)
    .join(", ") || null;
}
