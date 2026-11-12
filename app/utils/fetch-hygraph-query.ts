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
  const url = process.env.HYGRAPH_URL;
  const token = process.env.HYGRAPH_TOKEN;

  if (!url) throw new Error('Missing required environment variable HYGRAPH_URL');
  if (!token) throw new Error('Missing required environment variable HYGRAPH_TOKEN');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    next: {
      revalidate,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Hygraph request "${operation}" failed with status ${response.status}`);
  }

  let body: { data?: T; errors?: { message?: string }[] };
  try {
    body = await response.json();
  } catch {
    throw new Error(`Hygraph request "${operation}" returned a non-JSON response`);
  }
  const { data, errors } = body;

  if (errors?.length) {
    const messages = errors.map((e: { message?: string }) => e.message).join('; ');
    throw new Error(`Hygraph operation "${operation}" returned errors: ${messages}`);
  }

  return data as T;
};
