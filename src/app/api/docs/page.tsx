import { H1, H2, H3, P } from "@/components/typography";

export default function APIDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <H1 className="mb-8">DevCrate API Documentation</H1>

      <div className="space-y-8">
        <section>
          <H2 className="mb-4">Overview</H2>
          <P className="mb-4">
            The DevCrate API provides programmatic access to our curated
            collection of developer tools. All endpoints return JSON responses
            and support CORS for client-side applications.
          </P>

          <div className="bg-muted/50 p-4 rounded-lg">
            <P className="font-mono text-sm">
              Base URL:{" "}
              <code className="bg-background px-2 py-1 rounded">
                https://devcrate.dev/api
              </code>
            </P>
          </div>
        </section>

        <section>
          <H2 className="mb-4">Endpoints</H2>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <H3 className="mb-2">GET /api/tools</H3>
              <P className="mb-4">
                Returns the complete tools catalog with all tools and their
                associated tags.
              </P>

              <div className="space-y-3">
                <div>
                  <P className="font-semibold mb-2">Query Parameters:</P>
                  <ul className="space-y-1 ml-4">
                    <li>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        format
                      </code>{" "}
                      - Response format: &apos;full&apos; | &apos;compact&apos;
                      (default: &apos;full&apos;)
                    </li>
                    <li>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        tags
                      </code>{" "}
                      - Filter by tags (comma-separated):
                      &apos;react,ui,components&apos;
                    </li>
                    <li>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        search
                      </code>{" "}
                      - Search tools by title: &apos;tailwind&apos;
                    </li>
                  </ul>
                </div>

                <div>
                  <P className="font-semibold mb-2">Example Response:</P>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    {`{
  "success": true,
  "data": {
    "tools": [
      {
        "id": "tailwind-css",
        "title": "Tailwind CSS",
        "url": "https://tailwindcss.com/",
        "description": "A utility-first CSS framework...",
        "favicon": "https://tailwindcss.com/favicon.ico",
        "tags": [
          {
            "id": "css",
            "name": "CSS",
            "color": "#3B82F6"
          }
        ],
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "tags": [...]
  },
  "meta": {
    "total": 62,
    "timestamp": "2024-01-20T12:00:00Z",
    "version": "1.0.0"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <H3 className="mb-2">GET /api/tools/tags</H3>
              <P className="mb-4">
                Returns all available tags with their tool counts.
              </P>

              <div>
                <P className="font-semibold mb-2">Example Response:</P>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "react",
        "name": "React",
        "color": "#61DAFB",
        "toolCount": 15
      }
    ],
    "totalTags": 50
  }
}`}
                </pre>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <H3 className="mb-2">GET /api/tools/stats</H3>
              <P className="mb-4">Returns catalog statistics and insights.</P>

              <div>
                <P className="font-semibold mb-2">Example Response:</P>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {`{
  "success": true,
  "data": {
    "overview": {
      "totalTools": 62,
      "totalTags": 50,
      "averageTagsPerTool": 2.4,
      "recentlyAdded": 5
    },
    "tags": {
      "mostPopular": [
        { "name": "React", "count": 15 },
        { "name": "UI", "count": 12 }
      ]
    }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section>
          <H2 className="mb-4">Rate Limiting</H2>
          <P>
            Currently, there are no rate limits on the API. However, responses
            are cached for optimal performance:
          </P>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>/api/tools: 5 minutes</li>
            <li>/api/tools/tags: 10 minutes</li>
            <li>/api/tools/stats: 1 hour</li>
          </ul>
        </section>

        <section>
          <H2 className="mb-4">CORS</H2>
          <P>
            All API endpoints support Cross-Origin Resource Sharing (CORS) and
            can be accessed from any domain.
          </P>
        </section>

        <section>
          <H2 className="mb-4">Error Handling</H2>
          <P className="mb-4">All errors return a consistent format:</P>

          <pre className="bg-muted p-4 rounded-lg text-sm">
            {`{
  "success": false,
  "error": "Error type",
  "message": "Human readable error message"
}`}
          </pre>
        </section>

        <section>
          <H2 className="mb-4">Example Usage</H2>

          <div className="space-y-4">
            <div>
              <P className="font-semibold mb-2">JavaScript/Fetch:</P>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {`// Fetch all React tools
const response = await fetch('/api/tools?tags=react');
const data = await response.json();

if (data.success) {
  console.log(\`Found \${data.meta.total} React tools\`);
  data.data.tools.forEach(tool => {
    console.log(tool.title, tool.url);
  });
}`}
              </pre>
            </div>

            <div>
              <P className="font-semibold mb-2">cURL:</P>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {`# Get all tools in compact format
curl "https://devcrate.dev/api/tools?format=compact"

# Search for Tailwind tools
curl "https://devcrate.dev/api/tools?search=tailwind"

# Get statistics
curl "https://devcrate.dev/api/tools/stats"`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
