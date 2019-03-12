import React, { ReactNode } from "react";

interface IfProps {
  predicate: boolean;
  children: () => ReactNode;
}
export function If({ predicate, children }: IfProps) {
  return <>{predicate ? children() : null}</>;
}
