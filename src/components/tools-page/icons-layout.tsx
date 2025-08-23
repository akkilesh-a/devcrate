"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { ResourceIcon } from "./resource-icon";
import type { Resource } from "@/types/tools";

interface IconsLayoutProps {
  resources: Resource[];
  cardVariants: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function IconsLayout({ resources, cardVariants }: IconsLayoutProps) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-16 gap-4">
      {resources.map((resource) => (
        <motion.div
          key={resource.id}
          variants={cardVariants}
          className="cursor-target"
        >
          <Card className="p-3 hover:bg-muted/50 w-full">
            <CardContent className="p-0">
              <div className="flex flex-col items-center gap-2 w-full">
                {/* Icon container with fixed dimensions */}
                <ResourceIcon
                  favicon={resource.favicon}
                  title={resource.title}
                  size="large"
                />

                {/* Title and link with proper width constraints */}
                <div className="text-center w-full min-w-0">
                  <motion.a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:text-primary line-clamp-2 block w-full break-words"
                    whileHover={{ y: -2 }}
                    title={resource.title}
                  >
                    {resource.title}
                  </motion.a>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-1"
                  >
                    <Globe className="h-3 w-3 text-muted-foreground mx-auto" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
