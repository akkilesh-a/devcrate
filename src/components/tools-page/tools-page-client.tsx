"use client";

import { useState, useMemo, useEffect } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
        resource.tags.some((tag) => selectedTags.includes(tag.name))
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      filtered = searchResults.map((result) => result.item);
    }

    return filtered;
  }, [initialResources, selectedTags, searchQuery, fuse]);

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
            onSearchChange={setSearchQuery}
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
