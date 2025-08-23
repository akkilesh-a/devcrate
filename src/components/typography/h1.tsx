import React, { ReactNode } from "react";

export const H1 = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight text-balance ${className}`}
    >
      {children}
    </div>
  );
};
