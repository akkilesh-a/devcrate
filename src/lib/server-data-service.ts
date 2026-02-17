import { prisma } from "./prisma";
import type { Resource, Tag } from "@/types/tools";

// Type for the Prisma response structure since we're using include
type ResourceWithTags = {
  id: string;
  title: string;
  url: string;
  favicon: string | null;
  createdAt: Date;
  updatedAt: Date;
  resourceTags: {
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }[];
};

export interface ServerFetchDataResult {
  resources: Resource[];
  tags: Tag[];
}

/**
 * Server-side data fetching for tools and tags
 * This runs at build time and on each request for better SEO
 * Uses Prisma directly to access the database, bypassing RLS issues
 */
export async function fetchToolsDataServer(): Promise<ServerFetchDataResult> {
  try {
    // Fetch all resources with their tags
    const resources = await prisma.resource.findMany({
      orderBy: {
        title: "asc",
      },
      include: {
        resourceTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Fetch all tags for the filter list
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });

    console.log(
      `Server: Fetched ${resources.length} tools and ${tags.length} tags`
    );

    // Transform Prisma result to our internal Resource type
    const transformedResources: Resource[] = resources.map(
      (resource: ResourceWithTags) => ({
        id: resource.id,
        title: resource.title,
        url: resource.url,
        favicon: resource.favicon || undefined,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
        tags: resource.resourceTags.map((rt) => ({
          id: rt.tag.id,
          name: rt.tag.name,
          color: rt.tag.color,
        })),
      })
    );

    return {
      resources: transformedResources,
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      })),
    };
  } catch (error) {
    console.error("Server data fetch error:", error);
    // Return empty data rather than throwing to prevent page crashes
    return {
      resources: [],
      tags: [],
    };
  }
}

/**
 * Revalidate tools data (for use with revalidatePath)
 * Call this when you want to refresh the server-side cache
 */
export async function revalidateToolsData() {
  // This would be used with revalidatePath('/tools') in actions
  return fetchToolsDataServer();
}
