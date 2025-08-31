export function GET() {
  return new Response(`User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml`, {
    headers: { "content-type": "text/plain" },
  });
}
