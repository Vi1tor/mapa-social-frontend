import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

export function Header({ onLogin, onLogout, userName, isLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pathname = location.pathname.toLowerCase(); 
  const isAcessoPage = pathname.includes("/acesso");

  const isActive = (path) => pathname === path.toLowerCase();
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className={`header-container ${isAcessoPage ? "header-acesso" : ""}`}>
        
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <img
            src="/src/assets/icons/map.png"
            alt="Ícone do mapa"
            className="header-icon"
          />
          <h1 className="header-title">Mapa Social</h1>
        </Link>

        {!isAcessoPage && (
          <>
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
                  {
                  userName && (
                    
                    <div className="user-menu-container" ref={userMenuRef}>
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
                      </>

                      <div 
                        className="user-info" 
                        onClick={() => {
                          navigate("/acesso");
                          closeMenu();
                        }}
                      >
                        <div className="user-avatar">
                          <span className="user-initial">{userName[0].toUpperCase()}</span>
                        </div>
                        <span className="user-name">{userName}</span>
                      </div>

                      {userMenuOpen && (
                        <div className="user-dropdown">
                          <button 
                            className="dropdown-item"
                            onClick={() => {
                              navigate('/acesso');
                              setUserMenuOpen(false);
                              closeMenu();
                            }}
                          >
                            🏠 Minha Área
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={() => {
                              navigate('/favoritos');
                              setUserMenuOpen(false);
                              closeMenu();
                            }}
                          >
                            ⭐ Favoritos
                          </button>
                          <button 
                            className="dropdown-item"
                            onClick={() => {
                              navigate('/sugestoes');
                              setUserMenuOpen(false);
                              closeMenu();
                            }}
                          >
                            💡 Sugestões
                          </button>
                          <button 
                            className="dropdown-item admin"
                            onClick={() => {
                              navigate('/admin');
                              setUserMenuOpen(false);
                              closeMenu();
                            }}
                          >
                            🔐 Painel Admin
                          </button>
                          <div className="dropdown-divider"></div>
                          <button
                            className="dropdown-item logout"
                            onClick={() => {
                              onLogout?.();
                              setUserMenuOpen(false);
                              closeMenu();
                            }}
                          >
                            🚪 Sair
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </nav>
          </>
        )}

        {isAcessoPage && (
          <button
            className="button-access"
            onClick={() => {
              onLogout?.();
              navigate("/");
            }}
          >
            SAIR
          </button>
        )}
      </div>
    </header>
  );
}
