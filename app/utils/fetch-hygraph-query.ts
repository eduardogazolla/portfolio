type FetchHygraphQueryOptions = {
  variables?: Record<string, unknown>;
  /** Cache lifetime in seconds (Next.js `fetch` option `next.revalidate`). */
  revalidate?: number;
};

const getOperationName = (query: string): string =>
  query.match(/\b(?:query|mutation)\s+([A-Za-z_]\w*)/)?.[1] ?? 'anonymous';

/**
 * Runs a Hygraph GraphQL operation. Dynamic values go in `variables`, never
 * interpolated into `query`. Throws on non-OK responses and on GraphQL
 * `errors`; messages carry the operation name but never the token.
 */
export const fetchHygraphQuery = async <T>(
  query: string,
  { variables, revalidate }: FetchHygraphQueryOptions = {},
): Promise<T> => {
  const operation = getOperationName(query);

  const response = await fetch(process.env.HYGRAPH_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
    },
    next: {
      revalidate,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Hygraph request "${operation}" failed with status ${response.status}`);
  }

  const { data, errors } = await response.json();

  if (errors?.length) {
    const messages = errors.map((e: { message?: string }) => e.message).join('; ');
    throw new Error(`Hygraph operation "${operation}" returned errors: ${messages}`);
  }

  return data;
};
