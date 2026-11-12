// Next's documented pattern for inline head scripts (guide "preventing flash before hydration"):
// the script runs from the server HTML as `text/javascript`; when React renders the root layout on
// the client it is inert `text/plain`, which avoids React's "Encountered a script tag while
// rendering React component" dev warning. `suppressHydrationWarning` covers the type difference.
export const InlineScript = ({ html }: { html: string }) => (
  <script
    type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
    suppressHydrationWarning
    dangerouslySetInnerHTML={{ __html: html }}
  />
);
