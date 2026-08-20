import {router} from "expo-router";
import {useTranslation} from "react-i18next";

import OnboardingSlide from "@/components/onboarding/OnboardingSlide";

export default function OnboardingThree() {
  const {t} = useTranslation();

  return (
    <OnboardingSlide
      title={t("onboarding.slide3.title")}
      description={t("onboarding.slide3.description")}
      step={3}
      totalSteps={3}
      buttonLabel={t("onboarding.getStarted")}
      onContinue={() => {
        router.replace("/role");
      }}
    />
  );
}