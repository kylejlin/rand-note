import React from "react";
import "./BorderedFittedSection.css";

export function BorderedFittedSection({
  children,
}: BorderedFittedSectionProps): React.ReactElement {
  return (
    <section className="BorderedSection BorderedSection--fitted">
      <div className="FittedContainer">{children}</div>
    </section>
  );
}

export interface BorderedFittedSectionProps {
  children: React.ReactNode;
}
