import { Link } from "react-router"

type LogoProps = {
  to?: string
}

export function Logo({ to = "/" }: LogoProps) {
  return (
    <Link
      aria-label="WorkX home"
      className="inline-flex items-center"
      to={to}
    >
      <img
        alt="WorkX — Local skills, direct connections"
        className="h-auto w-40 object-contain"
        src="/workx-logo-cropped.png"
      />
    </Link>
  )
}