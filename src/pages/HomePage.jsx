import { useState, useEffect } from "react";
import { ServiceCard } from "../components/Cards/ServiceCard";
import { Link } from "react-router-dom";
import "./HomePage.css";
import MapPage from "./Map.jsx";

function HomePage() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Localização permitida!");
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
        },
        (error) => {
          console.log("Erro ao obter localização:", error.message);
        }
      );
    } else {
      console.log("Geolocalização não é suportada no navegador.");
    }
  }, []);

  const handleCardClick = (serviceName) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(serviceName)) {
        const updated = prevSelected.filter((s) => s !== serviceName);
        setSearchText(updated.join(", "));
        return updated;
      } else {
        const updated = [...prevSelected, serviceName];
        setSearchText(updated.join(", "));
        return updated;
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    console.log("Buscando por:", searchText);
  };

  const services = [
    { icon: "/src/assets/images/saude-publica.png", title: "Saúde", subtitle: "Pública" },
    { icon: "/src/assets/images/educacao-publica.png", title: "Educação", subtitle: "Pública" },
    { icon: "/src/assets/images/lazer.png", title: "Lazer" },
    { icon: "/src/assets/images/alimentacao.png", title: "Alimentação" },
    { icon: "/src/assets/images/cursos-profissionalizantes.png", title: "Cursos", subtitle: "Profissionalizantes" },
    { icon: "/src/assets/images/emissao-de-documentos.png", title: "Emissão de", subtitle: "Documentos Gratuitos" },
    { icon: "/src/assets/images/transporte-publico.png", title: "Transporte", subtitle: "Público" },
    { icon: "/src/assets/images/moradia.png", title: "Moradia" },
    { icon: "/src/assets/images/assistencia-social.png", title: "Assistência", subtitle: "Social" },
  ];

  return (
    <div className="home-page">
      <main className="home-main">
        <div className="home-container">
          <section className="hero-section">
            <div className="hero-content">
              <h2 className="hero-title">
                Bem-vindo ao Mapa Social
              </h2>

              <div className="hero-subtitle">
                <p className="hero-subtitle-main">
                  Encontre aqui os serviços sociais disponíveis para você!
                </p>
                <p className="hero-subtitle-secondary">
                  Pensado para facilitar o acesso à saúde, educação, lazer e muito mais.
                </p>
              </div>

              <div className="search-bar-container">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Pesquise e explore o mapa social ..."
                    className="search-input"
                    value={searchText}
                    onChange={handleSearchChange}
                  />
                  <button type="submit" className="search-button" onClick={handleSearch}>
                    <img
                      src="/src/assets/icons/lupa.png"
                      alt="Buscar"
                      className="search-icon"
                    />
                  </button>
                </div>
              </div>

              {/* Mapa Interativo */}
              <div className="map-placeholder">
                <MapPage height="100%" />
              </div>
            </div>
          </section>

          <section className="services-section">
            <h3 className="services-title">Serviços disponíveis:</h3>

            <div className="services-grid">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  iconSrc={service.icon}
                  title={service.title}
                  subtitle={service.subtitle}
                  selected={selectedServices.includes(
                    service.subtitle ? `${service.title} ${service.subtitle}` : service.title
                  )}
                  onClick={() =>
                    handleCardClick(
                      service.subtitle ? `${service.title} ${service.subtitle}` : service.title
                    )
                  }
                />
              ))}
            </div>
          </section>

          <section className="cta-section">
            <p className="cta-text">
              Quer indicar um serviço? Clique aqui e faça sua sugestão!
            </p>
            <Link to="/login" className="cta-button">
              Indicar
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
