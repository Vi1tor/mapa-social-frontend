import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
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

        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
          {!isAuthenticated ? (
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
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "nav-active" : ""}`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/sugestao"
                className={`nav-link ${isActive("/sugestao") ? "nav-active" : ""}`}
                onClick={closeMenu}
              >
                Sugerir Serviço
              </Link>
              {user && (
                <div className="user-info">
                  <div className="user-avatar">
                    <span className="user-initial">{user.nome[0]}</span>
                  </div>
                  <span className="user-name">{user.nome}</span>
                </div>
              )}
              <button onClick={handleLogout} className="button-access">
                SAIR
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
