import { useState, useEffect } from "react";
import { ServiceCard } from "../components/ServiceCard/ServiceCard";
import { Link } from "react-router-dom";
import { categoriaService, servicoService } from "../services/api";
import "./HomePage.css";

export default function HomePage() {
  const [categorias, setCategorias] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [catResponse, servResponse] = await Promise.all([
        categoriaService.listar(),
        servicoService.listar()
      ]);
      setCategorias(catResponse.data);
      setServicos(servResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      carregarDados();
      return;
    }

    try {
      setLoading(true);
      const response = await servicoService.buscarPorTermo(searchTerm);
      setServicos(response.data);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <main className="home-main">
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

            <form onSubmit={handleSearch} className="search-bar-container">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Pesquise e explore o mapa social ..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-button">
                  <img
                    src="/src/assets/icons/lupa.png"
                    alt="Buscar"
                    className="search-icon"
                  />
                </button>
              </div>
            </form>

            <div className="map-placeholder">
              <div className="map-placeholder-content">
                <p className="map-text">Mapa Interativo de Bragança Paulista</p>
                {loading ? (
                  <p>Carregando serviços...</p>
                ) : (
                  <p>{servicos.length} serviços disponíveis</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="services-section">
          <h3 className="services-title">Serviços disponíveis:</h3>

          {loading ? (
            <p>Carregando categorias...</p>
          ) : (
            <div className="services-grid">
              {categorias.map((categoria) => (
                <ServiceCard
                  key={categoria.id}
                  iconSrc={categoria.iconeUrl}
                  title={categoria.nome}
                  color={categoria.cor}
                />
              ))}
            </div>
          )}
        </section>

        <section className="cta-section">
          <p className="cta-text">
            Quer indicar um serviço? Clique aqui e faça sua sugestão!
          </p>
          <Link to="/sugestao" className="cta-button">
            Indicar
          </Link>
        </section>
      </main>
    </div>
  );
}
