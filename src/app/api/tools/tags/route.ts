import { NextResponse } from "next/server";
import { fetchToolsDataServer } from "@/lib/server-data-service";

/**
 * GET /api/tools/tags
 * Returns all available tags with their tool counts
 */
export async function GET() {
  try {
    const { resources, tags } = await fetchToolsDataServer();

    // Count tools per tag
    const tagCounts = new Map<string, number>();
    resources.forEach((resource) => {
      resource.tags.forEach((tag) => {
        tagCounts.set(tag.id, (tagCounts.get(tag.id) || 0) + 1);
      });
    });

    const tagsWithCounts = tags
      .map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        toolCount: tagCounts.get(tag.id) || 0,
      }))
      .sort((a, b) => b.toolCount - a.toolCount); // Sort by tool count

    const response = {
      success: true,
      data: {
        tags: tagsWithCounts,
        totalTags: tags.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=600", // Cache for 10 minutes
      },
    });
  } catch (error) {
    console.error("Tags API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tags",
      },
      { status: 500 }
    );
  }
}

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
