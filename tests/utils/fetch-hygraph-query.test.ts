const { fetchHygraphQuery } = jest.requireActual(
  '../../app/utils/fetch-hygraph-query',
) as typeof import('../../app/utils/fetch-hygraph-query');

const mockFetch = jest.fn();

const okResponse = (body: unknown) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve(body),
});

describe('fetchHygraphQuery', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch as unknown as typeof fetch;
    process.env.HYGRAPH_URL = 'https://cms.example/graphql';
    process.env.HYGRAPH_TOKEN = 'secret-token';
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('sends query and variables in the body', async () => {
    mockFetch.mockResolvedValue(okResponse({ data: { ok: true } }));

    const result = await fetchHygraphQuery('query Foo($slug: String!) { a }', {
      variables: { slug: 'x' },
    });

    expect(result).toEqual({ ok: true });
    const [, init] = mockFetch.mock.calls[0];
    expect(JSON.parse(init.body)).toEqual({
      query: 'query Foo($slug: String!) { a }',
      variables: { slug: 'x' },
    });
  });

  it('passes revalidate in next', async () => {
    mockFetch.mockResolvedValue(okResponse({ data: {} }));

    await fetchHygraphQuery('query Foo { a }', { revalidate: 86400 });

    expect(mockFetch.mock.calls[0][1].next).toEqual({ revalidate: 86400 });
  });

  it('throws with the operation name when the response has errors', async () => {
    mockFetch.mockResolvedValue(
      okResponse({ errors: [{ message: 'Field "a" not found' }] }),
    );

    await expect(fetchHygraphQuery('query ProjectsPage { a }')).rejects.toThrow(
      /ProjectsPage/,
    );
  });

  const caughtMessage = async (promise: Promise<unknown>) => {
    try {
      await promise;
    } catch (e) {
      return (e as Error).message;
    }
    throw new Error('expected promise to reject');
  };

  it('does not leak the token on GraphQL errors', async () => {
    mockFetch.mockResolvedValue(okResponse({ errors: [{ message: 'boom' }] }));
    const message = await caughtMessage(fetchHygraphQuery('query Foo { a }'));
    expect(message).toMatch(/Foo/);
    expect(message).not.toContain('secret-token');
  });

  it('throws on a non-OK response without leaking the token', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) });
    const message = await caughtMessage(fetchHygraphQuery('query Foo { a }'));
    expect(message).toMatch(/500/);
    expect(message).not.toContain('secret-token');
  });

  it('throws with the operation name on a non-JSON body, without leaking the token', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.reject(new SyntaxError('Unexpected token < in JSON')),
    });
    const message = await caughtMessage(fetchHygraphQuery('query Foo { a }'));
    expect(message).toMatch(/Foo/);
    expect(message).not.toContain('secret-token');
  });

  describe('missing configuration', () => {
    const originalUrl = process.env.HYGRAPH_URL;
    const originalToken = process.env.HYGRAPH_TOKEN;

    afterEach(() => {
      process.env.HYGRAPH_URL = originalUrl;
      process.env.HYGRAPH_TOKEN = originalToken;
    });

    it.each(['HYGRAPH_URL', 'HYGRAPH_TOKEN'])('fails fast naming %s', async (name) => {
      delete process.env[name];
      const message = await caughtMessage(fetchHygraphQuery('query Foo { a }'));
      expect(message).toContain(name);
      expect(message).not.toContain('secret-token');
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
