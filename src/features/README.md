# Feature modules

Keep page-level flows grouped here as they become substantial:

- `auth/` — onboarding, sign-in and role-specific registration
- `customer/` — job creation, AI analysis and worker matches
- `worker/` — profile management and incoming job requests

The existing route pages in `src/pages/` remain the route entry points. They should compose feature components rather than accumulate business logic.
