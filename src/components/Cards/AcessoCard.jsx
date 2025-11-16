import React from "react";
import "./AcessoCard.css";

export function AcessoCard({ title, subtitle, onClick }) {
  return (
    <div className="service-card acesso-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <h4>{title}</h4>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
