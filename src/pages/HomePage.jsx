import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { ServiceCard } from "../components/ServiceCard/ServiceCard";
import { Link } from "react-router-dom";
import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home-page">
      <Header currentPage="home" />

      <main className="home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">
              Bem-vindo ao <span className="highlight-red">Mapa Social</span>
            </h2>

            <div className="hero-subtitle">
              <p className="hero-subtitle-main">
                Encontre aqui os serviços sociais disponíveis para você!
              </p>
              <p className="hero-subtitle-secondary">
                Pensado para facilitar o acesso a saúde, educação, lazer e muito mais.
              </p>
            </div>

            {/* Search Bar */}
            <div className="search-bar-container">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Pesquise e explore o mapa social ..."
                  className="search-input"
                />
                <img
                  src="/src/assets/icons/lupa.png"
                  alt="Buscar"
                  className="search-icon"
                />
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="map-placeholder">
              <div className="map-placeholder-content">
                <p className="map-text">Mapa Interativo de Bragança Paulista</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <h3 className="services-title">Serviços disponíveis:</h3>

          <div className="services-grid">
            <ServiceCard
              iconSrc="/src/assets/images/saude-publica.png"
              title="Saúde"
              subtitle="Pública"
            />
            <ServiceCard
              iconSrc="/src/assets/images/educacao-publica.png"
              title="Educação"
              subtitle="Pública"
            />
            <ServiceCard
              iconSrc="/src/assets/images/lazer.png"
              title="Lazer"
            />
            <ServiceCard
              iconSrc="/src/assets/images/alimentacao.png"
              title="Alimentação"
            />
            <ServiceCard
              iconSrc="/src/assets/images/cursos-profissionalizantes.png"
              title="Cursos"
              subtitle="Profissionalizantes"
            />
            <ServiceCard
              iconSrc="/src/assets/images/emissao-de-documentos.png"
              title="Emissão de"
              subtitle="Documentos Gratuitos"
            />
            <ServiceCard
              iconSrc="/src/assets/images/transporte-publico.png"
              title="Transporte"
              subtitle="Público"
            />
            <ServiceCard
              iconSrc="/src/assets/images/moradia.png"
              title="Moradia"
            />
            <ServiceCard
              iconSrc="/src/assets/images/assistencia-social.png"
              title="Assistência"
              subtitle="Social"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <p className="cta-text">
            Quer indicar um serviço? Clique aqui e faça sua sugestão!
          </p>
          <Link to="/login" className="cta-button">
            Indicar
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
