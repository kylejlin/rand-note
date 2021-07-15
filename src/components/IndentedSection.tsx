import React from "react";
import "./IndentedSection.css";

export function IndentedSection({
  children,
}: IndentedSectionProps): React.ReactElement {
  return <section className="IndentedSection">{children}</section>;
}

export interface IndentedSectionProps {
  children: React.ReactNode;
}
