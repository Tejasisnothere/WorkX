const MONGO_DUPLICATE_KEY_ERROR = 11000;

/**
 * True when `err` is a MongoDB duplicate-key error (E11000), e.g. from a
 * unique compound index being violated by a race between two concurrent
 * requests that both passed an earlier existence check.
 */
export function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: number }).code === MONGO_DUPLICATE_KEY_ERROR;
}

/**
 * Escapes regex metacharacters in user-supplied input before it's used to
 * build a `RegExp` for a Mongo `$regex` filter. Without this, a value like
 * `(a+)+$` in a query param can cause catastrophic backtracking (ReDoS) or
 * simply throw on invalid patterns.
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
