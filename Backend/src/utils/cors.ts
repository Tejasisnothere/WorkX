/**
 * Parses the CORS_ORIGIN environment variable into a value the `cors`
 * middleware understands.
 *
 * Supported formats:
 *   - unset / "*"          -> allow any origin (fine here: the API is
 *                             stateless-JWT-in-header, not cookie-based,
 *                             so a wildcard does not expose credentials)
 *   - "https://a.com"      -> a single allowed origin
 *   - "https://a.com,https://b.com" -> an explicit allowlist
 */
export function parseCorsOrigin(raw: string | undefined): string | string[] {
  if (!raw || raw.trim() === "" || raw.trim() === "*") {
    return "*";
  }

  const origins = raw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : "*";
}
