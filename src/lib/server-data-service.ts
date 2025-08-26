import { createClient } from "@supabase/supabase-js";
import type { Resource, Tag } from "@/types/tools";

// Server-side Supabase client (uses service key for better performance)
function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Type for the Supabase response structure
type ResourceTagData = {
  resourceId: string;
  tagId: string;
};

// Supabase raw data types
interface SupabaseResource {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  createdAt: string;
  updatedAt: string;
}

interface SupabaseTag {
  id: string;
  name: string;
  color: string;
}

export interface ServerFetchDataResult {
  resources: Resource[];
  tags: Tag[];
}

/**
 * Server-side data fetching for tools and tags
 * This runs at build time and on each request for better SEO
 */
export async function fetchToolsDataServer(): Promise<ServerFetchDataResult> {
  const supabase = createServerSupabaseClient();

  try {
    // Fetch all data in parallel for better performance
    const [
      { data: tagsData, error: tagsError },
      { data: resourcesData, error: resourcesError },
      { data: resourceTagsData, error: resourceTagsError },
    ] = await Promise.all([
      supabase.from("tags").select("*").order("name"),
      supabase.from("resources").select("*").order("title"),
      supabase.from("resource_tags").select("resourceId, tagId"),
    ]);

    // Handle errors
    if (tagsError) throw new Error(`Tags fetch error: ${tagsError.message}`);
    if (resourcesError)
      throw new Error(`Resources fetch error: ${resourcesError.message}`);
    if (resourceTagsError)
      throw new Error(
        `Resource tags fetch error: ${resourceTagsError.message}`
      );

    // Transform and join the data
    const result = transformServerDataWithRelations(
      resourcesData || [],
      tagsData || [],
      resourceTagsData || []
    );

    console.log(
      `Server: Fetched ${result.resources.length} tools and ${result.tags.length} tags`
    );

    return result;
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
 * Server-side data transformation
 * Handles the manual joining of resources with their tags
 */
function transformServerDataWithRelations(
  resourcesData: SupabaseResource[],
  tagsData: SupabaseTag[],
  resourceTagsData: ResourceTagData[]
): ServerFetchDataResult {
  // Create a map of tagId to tag for quick lookup
  const tagsMap = new Map<string, Tag>();
  tagsData.forEach((tag) => {
    tagsMap.set(tag.id, tag);
  });

  // Create a map of resourceId to tags
  const resourceTagsMap = new Map<string, Tag[]>();
  resourceTagsData.forEach((rt: ResourceTagData) => {
    if (rt.resourceId && rt.tagId) {
      const tag = tagsMap.get(rt.tagId);
      if (tag) {
        if (!resourceTagsMap.has(rt.resourceId)) {
          resourceTagsMap.set(rt.resourceId, []);
        }
        resourceTagsMap.get(rt.resourceId)!.push(tag);
      }
    }
  });

  // Transform the data to match our Resource type
  const transformedResources: Resource[] = resourcesData.map((resource) => ({
    id: resource.id,
    title: resource.title,
    url: resource.url,
    favicon: resource.favicon,
    createdAt: new Date(resource.createdAt),
    updatedAt: new Date(resource.updatedAt),
    tags: resourceTagsMap.get(resource.id) || [],
  }));

  return {
    resources: transformedResources,
    tags: tagsData,
  };
}

/**
 * Revalidate tools data (for use with revalidatePath)
 * Call this when you want to refresh the server-side cache
 */
export async function revalidateToolsData() {
  // This would be used with revalidatePath('/tools') in actions
  return fetchToolsDataServer();
}
