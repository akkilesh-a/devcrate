"use client";

import { Grid, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui";
import type { LayoutType, LayoutSwitcherProps } from "@/types/tools";

export function LayoutSwitcher({
  currentLayout,
  onLayoutChange,
}: LayoutSwitcherProps) {
  const handleLayoutChange = (layout: LayoutType) => {
    // Save to localStorage
    localStorage.setItem("devcrate-layout", layout);
    onLayoutChange(layout);
  };

  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      <Button
        variant={currentLayout === "icons" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleLayoutChange("icons")}
        className="px-3"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={currentLayout === "cards" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleLayoutChange("cards")}
        className="px-3"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={currentLayout === "bricks" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleLayoutChange("bricks")}
        className="px-3"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
