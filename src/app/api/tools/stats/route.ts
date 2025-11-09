import { NextResponse } from "next/server";
import { fetchToolsDataServer } from "@/lib/server-data-service";

/**
 * GET /api/tools/stats
 * Returns catalog statistics and insights
 */
export async function GET() {
  try {
    const { resources, tags } = await fetchToolsDataServer();

    // Calculate statistics
    const totalTools = resources.length;
    const totalTags = tags.length;

    // Tools per tag distribution
    const tagDistribution = new Map<string, number>();
    resources.forEach((resource) => {
      resource.tags.forEach((tag) => {
        tagDistribution.set(tag.name, (tagDistribution.get(tag.name) || 0) + 1);
      });
    });

    // Most popular tags (top 10)
    const popularTags = Array.from(tagDistribution.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Tools with most tags
    const toolsWithMostTags = resources
      .sort((a, b) => b.tags.length - a.tags.length)
      .slice(0, 5)
      .map((tool) => ({
        title: tool.title,
        tagCount: tool.tags.length,
        tags: tool.tags.map((tag) => tag.name),
      }));

    // Recently added tools (last 30 days if dates are meaningful)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTools = resources.filter(
      (tool) => tool.createdAt > thirtyDaysAgo
    ).length;

    // Tools with favicons vs without
    const toolsWithFavicons = resources.filter((tool) => tool.favicon).length;
    const toolsWithoutFavicons = totalTools - toolsWithFavicons;

    const stats = {
      overview: {
        totalTools,
        totalTags,
        averageTagsPerTool: Number(
          (
            resources.reduce((sum, tool) => sum + tool.tags.length, 0) /
            totalTools
          ).toFixed(2)
        ),
        recentlyAdded: recentTools,
      },
      tags: {
        mostPopular: popularTags,
        distribution: Object.fromEntries(tagDistribution),
      },
      tools: {
        withMostTags: toolsWithMostTags,
        faviconCoverage: {
          withFavicons: toolsWithFavicons,
          withoutFavicons: toolsWithoutFavicons,
          percentage: Number(
            ((toolsWithFavicons / totalTools) * 100).toFixed(1)
          ),
        },
      },
    };

    const response = {
      success: true,
      data: stats,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Stats API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch statistics",
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
