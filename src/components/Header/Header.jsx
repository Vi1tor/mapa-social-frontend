import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export function Header({ isLoggedIn = false, onLogout, userName }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <img
            src="/src/assets/icons/map.png"
            alt="Ícone do mapa"
            className="header-icon"
          />
          <h1 className="header-title">Mapa Social</h1>
        </Link>

        {/* Botão hamburguer (visível no mobile) */}
        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Navegação */}
        <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
          {!isLoggedIn ? (
            <>
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "nav-active" : ""}`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/sobre"
                className={`nav-link ${isActive("/sobre") ? "nav-active" : ""}`}
                onClick={closeMenu}
              >
                Sobre
              </Link>
              <Link
                to="/contato"
                className={`nav-link ${isActive("/contato") ? "nav-active" : ""}`}
                onClick={closeMenu}
              >
                Contato
              </Link>
              <Link to="/login" className="button-access" onClick={closeMenu}>
                ACESSAR
              </Link>
            </>
          ) : (
            <>
              {userName && (
                <div className="user-info" onClick={closeMenu}>
                  <div className="user-avatar">
                    <span className="user-initial">{userName[0]}</span>
                  </div>
                </div>
              )}
              <button onClick={() => { onLogout(); closeMenu(); }} className="button-access">
                SAIR
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
