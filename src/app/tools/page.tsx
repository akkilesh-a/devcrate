"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Fuse from "fuse.js";
import { Button, Input } from "@/components/ui";
import { H1, H3, P } from "@/components/typography";
import {
  Filters,
  LayoutSwitcher,
  IconsLayout,
  CardsLayout,
  BricksLayout,
  IconsLayoutSkeleton,
  CardsLayoutSkeleton,
  BricksLayoutSkeleton,
  FiltersSkeleton,
  ResultsSummarySkeleton,
} from "@/components/tools-page";
import { supabase } from "@/lib/supabase";
import type { Resource, LayoutType, Tag } from "@/types/tools";

// Type for the Supabase response structure
type ResourceTagData = {
  resourceId: string;
  tagId: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutType>("cards");

  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch tags
      const { data: tagsData, error: tagsError } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (tagsError) throw tagsError;
      setAllTags(tagsData || []);

      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from("resources")
        .select("*")
        .order("title");

      if (resourcesError) throw resourcesError;

      // Fetch all resource-tag relationships with simple joins
      const { data: resourceTagsData, error: resourceTagsError } =
        await supabase.from("resource_tags").select(`
          resourceId,
          tagId
        `);

      if (resourceTagsError) throw resourceTagsError;

      console.log(
        "Fetched",
        resourcesData?.length || 0,
        "resources and",
        resourceTagsData?.length || 0,
        "resource-tag relationships"
      );

      // Create a map of tagId to tag for quick lookup
      const tagsMap = new Map<string, Tag>();
      (tagsData || []).forEach((tag) => {
        tagsMap.set(tag.id, tag);
      });

      // Create a map of resourceId to tags
      const resourceTagsMap = new Map<string, Tag[]>();
      resourceTagsData?.forEach((rt: ResourceTagData) => {
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
      const transformedResources: Resource[] = (resourcesData || []).map(
        (resource) => ({
          id: resource.id,
          title: resource.title,
          url: resource.url,
          favicon: resource.favicon,
          createdAt: new Date(resource.createdAt),
          updatedAt: new Date(resource.updatedAt),
          tags: resourceTagsMap.get(resource.id) || [],
        })
      );

      console.log(
        "Transformed resources with tags:",
        transformedResources.slice(0, 3)
      ); // Debug log
      setResources(transformedResources);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data and layout
  useEffect(() => {
    // Load saved layout from localStorage
    const savedLayout = localStorage.getItem("devcrate-layout") as LayoutType;
    if (savedLayout && ["icons", "cards", "bricks"].includes(savedLayout)) {
      setLayout(savedLayout);
    }

    // Fetch data from Supabase
    fetchData();
  }, []);

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(resources, {
      keys: [
        { name: "title", weight: 0.6 },
        { name: "tags.name", weight: 0.4 },
      ],
      threshold: 0.3,
      includeScore: true,
    });
  }, [resources]);

  // Filter and search resources
  const filteredResources = useMemo(() => {
    let filtered = resources;

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter((resource) =>
        resource.tags.some((tag) => selectedTags.includes(tag.name))
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      filtered = searchResults.map((result) => result.item);
    }

    return filtered;
  }, [resources, selectedTags, searchQuery, fuse]);

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((tag) => tag !== tagName)
        : [...prev, tagName]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  const renderLayout = () => {
    switch (layout) {
      case "icons":
        return (
          <IconsLayout
            resources={filteredResources}
            cardVariants={cardVariants}
          />
        );
      case "cards":
        return (
          <CardsLayout
            resources={filteredResources}
            cardVariants={cardVariants}
          />
        );
      case "bricks":
        return (
          <BricksLayout
            resources={filteredResources}
            cardVariants={cardVariants}
          />
        );
      default:
        return (
          <IconsLayout
            resources={filteredResources}
            cardVariants={cardVariants}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen relative">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="text-center mb-8">
              <H1 className="mb-4">Developer Tools Catalog</H1>
              <P size="large" className="max-w-2xl mx-auto">
                Loading tools...
              </P>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-6"
          >
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search tools or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
                disabled
              />
            </div>

            {/* Filters and Layout Controls */}
            <div className="flex items-center justify-between">
              <FiltersSkeleton />
              <LayoutSwitcher
                currentLayout={layout}
                onLayoutChange={setLayout}
              />
            </div>
          </motion.div>

          {/* Skeleton Results Summary */}
          <ResultsSummarySkeleton />

          {/* Skeleton Layout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {layout === "icons" && <IconsLayoutSkeleton />}
            {layout === "cards" && <CardsLayoutSkeleton />}
            {layout === "bricks" && <BricksLayoutSkeleton />}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <H1 className="mb-4">Developer Tools Catalog</H1>
            <P size="large" className="max-w-2xl mx-auto">
              Discover {resources.length} carefully curated developer tools
            </P>
          </div>

          {/* Error handling and refresh */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <P className="text-destructive">{error}</P>
                <Button onClick={fetchData} variant="outline" size="sm">
                  Retry
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search tools or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          {/* Filters and Layout Controls */}
          <div className="flex items-center justify-between">
            <Filters
              allTags={allTags}
              selectedTags={selectedTags}
              searchQuery={searchQuery}
              onToggleTag={toggleTag}
              onClearFilters={clearFilters}
            />
            <div className="flex items-center gap-3">
              <Button
                onClick={fetchData}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
              <LayoutSwitcher
                currentLayout={layout}
                onLayoutChange={setLayout}
              />
            </div>
          </div>
        </motion.div>

        {/* Filtered Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <P variant="muted">
            Showing {filteredResources.length} of {resources.length} tools
            {selectedTags.length > 0 && (
              <span> • Filtered by: {selectedTags.join(", ")}</span>
            )}
          </P>
        </motion.div>

        {/* Tools Grid */}
        <AnimatePresence mode="wait">
          {filteredResources.length > 0 ? (
            <motion.div
              key={`tools-${layout}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {renderLayout()}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <H3 className="mb-2">No tools found</H3>
              <P variant="muted" className="mb-6 max-w-md mx-auto">
                We couldn&apos;t find any tools matching your search. Try
                adjusting your filters or search terms.
              </P>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
