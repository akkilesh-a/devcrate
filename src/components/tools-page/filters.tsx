"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui";
import type { FiltersProps } from "@/types/tools";

export function Filters({
  allTags,
  selectedTags,
  onToggleTag,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tag) => (
        <motion.div
          key={tag.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Badge
            variant={selectedTags.includes(tag.name) ? "default" : "secondary"}
            className="cursor-pointer"
            style={{
              backgroundColor: selectedTags.includes(tag.name)
                ? tag.color
                : undefined,
              borderColor: tag.color + "40",
            }}
            onClick={() => onToggleTag(tag.name)}
          >
            {tag.name}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}
