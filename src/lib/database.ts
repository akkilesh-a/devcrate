import { supabase } from "./supabase";
import type { Resource, Tag } from "@/types";

export interface DatabaseResource {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  created_at: string;
  updated_at: string;
  resource_tags: {
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }[];
}

export class DatabaseService {
  async getResources(): Promise<Resource[]> {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select(
          `
          *,
          resource_tags (
            tag:tags (*)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching resources:", error);
        throw error;
      }

      return (data as DatabaseResource[]).map(this.transformResource);
    } catch (error) {
      console.error("Database error:", error);
      // Return empty array as fallback
      return [];
    }
  }

  async getTags(): Promise<Tag[]> {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching tags:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Database error:", error);
      return [];
    }
  }

  async searchResources(query: string): Promise<Resource[]> {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select(
          `
          *,
          resource_tags (
            tag:tags (*)
          )
        `
        )
        .ilike("title", `%${query}%`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error searching resources:", error);
        throw error;
      }

      return (data as DatabaseResource[]).map(this.transformResource);
    } catch (error) {
      console.error("Database search error:", error);
      return [];
    }
  }

  async getResourcesByTag(tagName: string): Promise<Resource[]> {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select(
          `
          *,
          resource_tags!inner (
            tag:tags!inner (*)
          )
        `
        )
        .eq("resource_tags.tag.name", tagName)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching resources by tag:", error);
        throw error;
      }

      return (data as DatabaseResource[]).map(this.transformResource);
    } catch (error) {
      console.error("Database tag filter error:", error);
      return [];
    }
  }

  private transformResource(dbResource: DatabaseResource): Resource {
    return {
      id: dbResource.id,
      title: dbResource.title,
      url: dbResource.url,
      favicon: dbResource.favicon,
      createdAt: new Date(dbResource.created_at),
      updatedAt: new Date(dbResource.updated_at),
      tags: dbResource.resource_tags.map((rt) => rt.tag),
    };
  }
}

export const db = new DatabaseService();
