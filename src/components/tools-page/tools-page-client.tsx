"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Fuse from "fuse.js";
import { Button } from "@/components/ui";
import { H3, P } from "@/components/typography";
import type { Resource, LayoutType, Tag } from "@/types/tools";
import {
  Filters,
  LayoutSwitcher,
  IconsLayout,
  CardsLayout,
  BricksLayout,
  SearchBar,
} from ".";

interface ToolsPageClientProps {
  initialResources: Resource[];
  initialTags: Tag[];
  initialLayout?: LayoutType;
}

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

export function ToolsPageClient({
  initialResources,
  initialTags,
  initialLayout = "cards",
}: ToolsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q")?.toString() || "",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || [],
  );
  const [layout, setLayout] = useState<LayoutType>(initialLayout);

  // Load saved layout from localStorage on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLayout = localStorage.getItem("devcrate-layout") as LayoutType;
      if (savedLayout && ["icons", "cards", "bricks"].includes(savedLayout)) {
        setLayout(savedLayout);
      }
    }
  }, []);

  // Sync State FROM URL (Handle Back/Forward)
  useEffect(() => {
    const urlQ = searchParams.get("q")?.toString() || "";
    const urlTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];

    if (urlQ !== searchQuery) {
      setSearchQuery(urlQ);
    }

    // content check for tags
    const sortedUrlTags = [...urlTags].sort().join(",");
    const sortedStateTags = [...selectedTags].sort().join(",");
    if (sortedUrlTags !== sortedStateTags) {
      setSelectedTags(urlTags);
    }
  }, [searchParams]);

  // Helper to update URL
  const updateUrl = useCallback(
    (
      newQuery: string,
      newTags: string[],
      method: "push" | "replace" = "replace",
    ) => {
      const params = new URLSearchParams();
      if (newQuery) params.set("q", newQuery);
      if (newTags.length > 0) params.set("tags", newTags.join(","));

      const newUrl = `${pathname}?${params.toString()}`;
      router[method](newUrl, { scroll: false });
    },
    [pathname, router],
  );

  // Effect to handle search query URL updates (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      const urlQ = searchParams.get("q")?.toString() || "";
      if (searchQuery !== urlQ) {
        updateUrl(searchQuery, selectedTags, "replace");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, updateUrl, searchParams, selectedTags]);

  // Wait, if I put selectedTags in `updateUrl` deps, it changes often.
  // Better: The effect solely handles search query changes.
  // But `updateUrl` needs current tags.
  // We can trust `selectedTags` state in the effect.

  // Handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // URL update handled by debounce effect
  };

  const toggleTag = (tagName: string) => {
    const newTags = selectedTags.includes(tagName)
      ? selectedTags.filter((t) => t !== tagName)
      : [...selectedTags, tagName];

    setSelectedTags(newTags);
    updateUrl(searchQuery, newTags, "push");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    updateUrl("", [], "push");
  };

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(initialResources, {
      keys: [
        { name: "title", weight: 0.6 },
        { name: "tags.name", weight: 0.4 },
      ],
      threshold: 0.3,
      includeScore: true,
    });
  }, [initialResources]);

  // Filter and search resources
  const filteredResources = useMemo(() => {
    let filtered = initialResources;

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter((resource) =>
        resource.tags.some((tag) => selectedTags.includes(tag.name)),
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      filtered = searchResults.map((result) => result.item);
    }

    return filtered;
  }, [initialResources, selectedTags, searchQuery, fuse]);

  /* Handlers replaced above */

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    if (typeof window !== "undefined") {
      localStorage.setItem("devcrate-layout", newLayout);
    }
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

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-6"
        >
          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />

          {/* Filters and Layout Controls */}
          <div className="flex items-center justify-between">
            <Filters
              allTags={initialTags}
              selectedTags={selectedTags}
              searchQuery={searchQuery}
              onToggleTag={toggleTag}
              onClearFilters={clearFilters}
            />
            <div className="flex items-center gap-3">
              <LayoutSwitcher
                currentLayout={layout}
                onLayoutChange={handleLayoutChange}
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
            Showing {filteredResources.length} of {initialResources.length}{" "}
            tools
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
