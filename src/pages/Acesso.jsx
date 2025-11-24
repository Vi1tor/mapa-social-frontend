import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AcessoCard } from "../components/Cards/AcessoCard";
import "./Acesso.css"; 

export function Acesso({ isLoggedIn, userName}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "false") {
      navigate("/login");
    }
    userName = localStorage.getItem("userName");
  }, [isLoggedIn, navigate]);

  const handleCardClick = (destination) => {
    navigate(destination);
  };

  return (
    <div className="acesso-page">
      <main className="acesso-main">
        <div className="acesso-container">

          <section className="acesso-section-wrapper">
            <h2 className="hero-title">
              Olá {userName} Seja Bem-vindo(a)
            </h2>

            <section className="acesso-section">
              <h3 className="services-title">O que deseja fazer?</h3>

              <div className="acesso-grid">
                <AcessoCard title="Acessar o Mapa Social" onClick={() => handleCardClick('/map')} />
                <AcessoCard title="Serviços Favoritos" onClick={() => handleCardClick('/favoritos')} />
                <AcessoCard title="Acompanhar Sugestões" onClick={() => handleCardClick('/sugestoes')} />
                <AcessoCard title="Visualizar Notícias" onClick={() => handleCardClick('/noticias')} />
              </div>
            </section>
          </section>

        </div>
      </main>
    </div>
  );
}
