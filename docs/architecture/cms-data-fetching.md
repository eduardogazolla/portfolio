# CMS data fetching

All Hygraph access goes through `fetchHygraphQuery` (`app/utils/fetch-hygraph-query.ts`).

- It fails fast if `HYGRAPH_URL` or `HYGRAPH_TOKEN` is missing, naming the variable (never its value).
- It throws on HTTP errors, non-JSON bodies and GraphQL `errors`. Messages include the operation name and never the token.
- Dynamic values (e.g. `$slug`) are always passed as GraphQL variables, never interpolated into the query.

## Error handling by caller

- **Pages** let the error propagate. With ISR, a failed revalidation keeps serving the last good page ([Next.js ISR guide](https://nextjs.org/docs/app/guides/incremental-static-regeneration)).
- **Layout socials** are wrapped in try/catch and degrade to no social links.
- **`generateStaticParams`** (`app/projects/[slug]`) intentionally throws on CMS failure: a loud build failure beats deploying without project pages.
- **`generateMetadata`** returns `{}` when the project is missing; the page itself calls `notFound()`.
