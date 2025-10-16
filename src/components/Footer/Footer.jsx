import "./Footer.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">Direitos Reservados, {currentYear}.</p>
      </div>
    </footer>
  );
}