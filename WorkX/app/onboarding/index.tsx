import {router} from "expo-router";
import {useTranslation} from "react-i18next";

import OnboardingSlide from "@/components/onboarding/OnboardingSlide";

export default function OnboardingOne() {
  const {t} = useTranslation();

  return (
    <OnboardingSlide
      title={t("onboarding.slide1.title")}
      description={t("onboarding.slide1.description")}
      step={1}
      totalSteps={3}
      buttonLabel={t("common.continue")}
      skipLabel={t("onboarding.skip")}
      onContinue={() => {
        router.push("/onboarding/second");
      }}
      onSkip={() => {
        router.replace("/auth/register");
      }}
    />
  );
}