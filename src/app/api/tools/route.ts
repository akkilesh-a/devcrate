import { NextRequest, NextResponse } from "next/server";
import { fetchToolsDataServer } from "@/lib/server-data-service";

// API Response types
interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total: number;
    timestamp: string;
    version: string;
  };
}

interface FullToolResponse {
  id: string;
  title: string;
  url: string;
  description: string;
  favicon?: string | null;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CompactToolResponse {
  id: string;
  title: string;
  url: string;
  favicon?: string | null;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

interface ToolsCatalogResponse {
  tools: FullToolResponse[] | CompactToolResponse[];
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

/**
 * GET /api/tools
 * Returns the complete tools catalog with all tools and tags
 *
 * Query Parameters:
 * - format: 'full' | 'compact' (default: 'full')
 * - tags: comma-separated list of tag names to filter by
 * - search: search query to filter tools by title
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "full";
    const tagsFilter = searchParams
      .get("tags")
      ?.split(",")
      .map((t) => t.trim());
    const searchQuery = searchParams.get("search");

    // Fetch data from server service
    const { resources, tags } = await fetchToolsDataServer();

    // Apply filters if provided
    let filteredResources = resources;

    // Filter by tags
    if (tagsFilter && tagsFilter.length > 0) {
      filteredResources = filteredResources.filter((resource) =>
        resource.tags.some((tag) =>
          tagsFilter.some((filterTag) =>
            tag.name.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredResources = filteredResources.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.tags.some((tag) => tag.name.toLowerCase().includes(query))
      );
    }

    // Format response based on requested format
    const responseData: ToolsCatalogResponse = {
      tools:
        format === "compact"
          ? filteredResources.map(
              (resource) =>
                ({
                  id: resource.id,
                  title: resource.title,
                  url: resource.url,
                  favicon: resource.favicon,
                  tags: resource.tags.map((tag) => ({
                    id: tag.id,
                    name: tag.name,
                    color: tag.color,
                  })),
                } as CompactToolResponse)
            )
          : filteredResources.map(
              (resource) =>
                ({
                  id: resource.id,
                  title: resource.title,
                  url: resource.url,
                  description: `${resource.title} - A powerful tool for developers`,
                  favicon: resource.favicon,
                  tags: resource.tags.map((tag) => ({
                    id: tag.id,
                    name: tag.name,
                    color: tag.color,
                  })),
                  createdAt: resource.createdAt.toISOString(),
                  updatedAt: resource.updatedAt.toISOString(),
                } as FullToolResponse)
            ),
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      })),
    };

    const response: APIResponse<ToolsCatalogResponse> = {
      success: true,
      data: responseData,
      meta: {
        total: filteredResources.length,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    };

    // Set CORS headers for public API access
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // Cache for 5 minutes
    };

    return NextResponse.json(response, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("API Error:", error);

    const errorResponse: APIResponse = {
      success: false,
      error: "Internal Server Error",
      message: "Failed to fetch tools catalog. Please try again later.",
      meta: {
        total: 0,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
}

/**
 * OPTIONS /api/tools
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
