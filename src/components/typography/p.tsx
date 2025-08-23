import React, { ReactNode } from "react";

export const P = ({
  children,
  className,
  variant = "default",
  size = "default",
}: {
  children?: ReactNode;
  className?: string;
  variant?: "default" | "muted";
  size?: "default" | "small" | "large";
}) => {
  return (
    <div
      className={`leading-7 ${size == "large" && "text-lg font-semibold"} ${
        size == "small" && "text-sm leading-none font-medium"
      } ${variant == "muted" && "text-muted-foreground text-sm"} ${className}`}
    >
      {children}
    </div>
  );
};
