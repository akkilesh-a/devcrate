"use client";

import { motion } from "framer-motion";
import type { LayoutType } from "@/types/tools";
import {
  FiltersSkeleton,
  ResultsSummarySkeleton,
  IconsLayoutSkeleton,
  CardsLayoutSkeleton,
  BricksLayoutSkeleton,
} from "./skeleton-layouts";
import { SearchBar } from "./search-bar";
import { LayoutSwitcher } from "./layout-switcher";

interface ToolsPageLoadingProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  layout?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
}

export function ToolsPageLoading({
  searchQuery = "",
  onSearchChange = () => {},
  layout = "cards",
  onLayoutChange = () => {},
}: ToolsPageLoadingProps) {
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
            onSearchChange={onSearchChange}
            disabled
          />

          {/* Filters and Layout Controls */}
          <div className="flex items-center justify-between">
            <FiltersSkeleton />
            <LayoutSwitcher
              currentLayout={layout}
              onLayoutChange={onLayoutChange}
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
