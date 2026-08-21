import {Alert} from "react-native";
import {router} from "expo-router";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import LocationPermission from "@/components/location/LocationPermission";
import {getUserCoordinates} from "@/services/location/location.service";

export default function SeekerLocationScreen() {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleAllowLocation = async () => {
    try {
      setLoading(true);

      const coordinates =
        await getUserCoordinates();

      if (!coordinates) {
        Alert.alert(
          t("location.permissionDenied"),
        );
        return;
      }

      console.log("Seeker coordinates:", coordinates);

      // Temporary:
      // Later we will save these to the user profile/backend
      // and then start the AI interview.

      router.replace("/seeker/profession");
    } catch (error) {
      console.error("Location error:", error);

      Alert.alert(
        t("location.unavailable"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocationPermission
      onAllow={handleAllowLocation}
      loading={loading}
    />
  );
}