import {router} from "expo-router";
import {useTranslation} from "react-i18next";

import OnboardingSlide from "@/components/onboarding/OnboardingSlide";

export default function OnboardingTwo() {
  const {t} = useTranslation();

  return (
    <OnboardingSlide
      title={t("onboarding.slide2.title")}
      description={t("onboarding.slide2.description")}
      step={2}
      totalSteps={3}
      buttonLabel={t("common.continue")}
      skipLabel={t("onboarding.skip")}
      onContinue={() => {
        router.push("/onboarding/third");
      }}
      onSkip={() => {
        router.replace("/role");
      }}
    />
  );
}