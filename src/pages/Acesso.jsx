import { useNavigate } from "react-router-dom";
import { AcessoCard } from "../components/Cards/AcessoCard";
import "./Acesso.css"; 

export function Acesso({ onLogin, userName = "Usuário" }) {
  const navigate = useNavigate();

  const handleCardClick = (destination) => {
    navigate(destination);
  };

  return (
    <div className="acesso-page">
      <main className="acesso-main">
        <div className="acesso-wrapper">
          <h2 className="hero-title">
            Olá {userName} <span className="highlight">Seja Bem-vindo(a)</span>
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
        </div>
      </main>
    </div>
  );
}
