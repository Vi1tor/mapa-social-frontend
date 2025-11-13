import "./ServiceCard.css";

export function ServiceCard({ iconSrc, title, subtitle, selected, onClick }) {
  return (
    <div
      className={`service-card ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <img src={iconSrc} alt={title} className="service-card-icon" />
      <h3 className="service-card-title">
        {title}
        {subtitle && <br />}
        {subtitle}
      </h3>
    </div>
  );
}
