import { Route, Routes } from "react-router"

import { LandingPage } from "../features/auth/pages/LandingPage"
import { LoginPage } from "../features/auth/pages/LoginPage"
import { RegisterPage } from "../features/auth/pages/RegisterPage"
import { LanguagePreferencePage } from "../features/auth/pages/LanguagePreferencePage"
import { WorkerSkillsPage } from "../features/auth/pages/WorkerSkillsPage"
import { CreateRequestPage } from "../features/customer/pages/CreateRequestPage"
import { CustomerDashboardPage } from "../features/customer/pages/CustomerDashboardPage"
import { MatchedWorkersPage } from "../features/customer/pages/MatchedWorkersPage"
import { WorkerDetailsPage } from "../features/customer/pages/WorkerDetailsPage"
import { JobRequestsPage } from "../features/worker/pages/JobRequestsPage"
import { WorkerDashboardPage } from "../features/worker/pages/WorkerDashboardPage"
import { WorkerProfilePage } from "../features/worker/pages/WorkerProfilePage"
import { OnboardingOnePage } from "../features/onboarding/pages/OnboardingOnePage"
import { OnboardingTwoPage } from "../features/onboarding/pages/OnboardingTwoPage"
import { OnboardingThreePage } from "../features/onboarding/pages/OnboardingThreePage"
import CustomerLayout from "../shared/layouts/CustomerLayout"
import WorkerLayout from "../shared/layouts/WorkerLayout"
import { VerifyPhonePage } from "../features/auth/pages/VerifyPhonePage"


export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingOnePage />} />
      <Route path="/onboarding" element={<OnboardingOnePage />} />
      <Route path="/onboarding/local" element={<OnboardingTwoPage />} />
      <Route path="/onboarding/access" element={<OnboardingThreePage />} />
      <Route path="/language" element={<LanguagePreferencePage />} />
      <Route path="/role" element={<RegisterPage />} />
      <Route path="/welcome" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/verify" element={<VerifyPhonePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/skills" element={<WorkerSkillsPage />} />

      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<CustomerDashboardPage />} />
        <Route path="request" element={<CreateRequestPage />} />
        <Route path="matches" element={<MatchedWorkersPage />} />
        <Route path="worker/:id" element={<WorkerDetailsPage />} />
      </Route>

      <Route path="/worker" element={<WorkerLayout />}>
        <Route index element={<WorkerDashboardPage />} />
        <Route path="requests" element={<JobRequestsPage />} />
        <Route path="profile" element={<WorkerProfilePage />} />
      </Route>
    </Routes>
  )
}
