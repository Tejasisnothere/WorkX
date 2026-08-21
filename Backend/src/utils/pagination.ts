export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Computes the skip offset and the pagination metadata block returned by
 * every paginated list endpoint (jobs, applications, saved jobs). Centralized
 * so the "totalPages" math (and its `|| 1` empty-result guard) only lives
 * in one place.
 */
export function buildPagination(page: number, limit: number, totalItems: number): PaginationMeta {
  return {
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit) || 1,
  };
}

export function paginationSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}
