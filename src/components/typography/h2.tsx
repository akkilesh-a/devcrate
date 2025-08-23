import React, { ReactNode } from "react";

export const H2 = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}
    >
      {children}
    </div>
  );
};