"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";
import { P } from "@/components/typography";
import { ResourceIcon } from "./resource-icon";
import type { Resource } from "@/types/tools";

interface BricksLayoutProps {
  resources: Resource[];
  cardVariants: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function BricksLayout({ resources, cardVariants }: BricksLayoutProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {resources.map((resource) => (
        <motion.div
          key={resource.id}
          variants={cardVariants}
          className="cursor-target"
        >
          <motion.div
            whileHover={{
              y: -4,
              transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20,
              },
            }}
            layout
          >
            <Card className="group p-3">
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <ResourceIcon
                    favicon={resource.favicon}
                    title={resource.title}
                    size="large"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0 gap-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <P
                        size="small"
                        className="font-semibold leading-tight group-hover:text-primary"
                      >
                        {resource.title}
                      </P>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      </a>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5 h-auto"
                          style={{
                            backgroundColor: tag.color + "20",
                            borderColor: tag.color + "40",
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
