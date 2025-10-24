import React from "react";

export function AcessoCard({ title, subtitle }) {
  return (
    <div className="service-card">
      <h4>{title}</h4>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
