"use client";

import { ExternalLink } from "lucide-react";

interface ResourceIconProps {
  favicon?: string | null;
  title: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

const sizeClasses = {
  small: {
    container: "w-8 h-8 p-1.5",
    image: "w-5 h-5",
    icon: "h-4 w-4",
  },
  medium: {
    container: "w-10 h-10 p-2",
    image: "w-6 h-6",
    icon: "h-5 w-5",
  },
  large: {
    container: "w-12 h-12 p-2",
    image: "w-8 h-8",
    icon: "h-6 w-6",
  },
};

export function ResourceIcon({
  favicon,
  title,
  size = "medium",
  className = "",
}: ResourceIconProps) {
  const classes = sizeClasses[size];

  return (
    <div
      className={`border rounded-lg flex items-center justify-center shrink-0 ${classes.container} ${className}`}
    >
      {favicon ? (
        <img
          src={favicon}
          alt={`${title} favicon`}
          className={`rounded object-contain ${classes.image}`}
          onError={(e) => {
            const parent = e.currentTarget.parentElement;
            if (parent) {
              e.currentTarget.style.display = "none";
              const icon = document.createElement("span");
              icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="${classes.icon} text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>`;
              parent.appendChild(icon);
            }
          }}
        />
      ) : (
        <ExternalLink className={`${classes.icon} text-muted-foreground`} />
      )}
    </div>
  );
}
