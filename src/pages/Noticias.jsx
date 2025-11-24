import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Noticias.css";

export function Noticias({ isLoggedIn, userName}) {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setNoticias([
        {
          id: 1,
          titulo: "Nova UBS inaugurada no Jardim das Flores",
          categoria: "Saúde",
          resumo: "A nova Unidade Básica de Saúde começou a atender a população da região norte da cidade.",
          data: "12/11/2025",
          imagem: "/src/assets/images/saude-publica.png"
        },
        {
          id: 2,
          titulo: "Inscrições abertas para cursos profissionalizantes gratuitos",
          categoria: "Educação",
          resumo: "SENAI oferece 200 vagas em cursos de capacitação profissional para jovens e adultos.",
          data: "10/11/2025",
          imagem: "/src/assets/images/cursos-profissionalizantes.png"
        },
        {
          id: 3,
          titulo: "Programa de distribuição de alimentos ampliado",
          categoria: "Assistência Social",
          resumo: "Prefeitura aumenta em 30% a distribuição de cestas básicas para famílias em situação de vulnerabilidade.",
          data: "08/11/2025",
          imagem: "/src/assets/images/alimentacao.png"
        },
        {
          id: 4,
          titulo: "Novo parque infantil no Bairro Central",
          categoria: "Lazer",
          resumo: "Espaço de lazer com playground, quadras e área verde foi entregue à comunidade.",
          data: "05/11/2025",
          imagem: "/src/assets/images/lazer.png"
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const categorias = ["Todas", "Saúde", "Educação", "Assistência Social", "Lazer"];

  const noticiasFiltradas = categoriaFiltro === "Todas" 
    ? noticias 
    : noticias.filter(n => n.categoria === categoriaFiltro);

  return (
    <div className="noticias-page">
      <main className="noticias-main">
        <div className="noticias-wrapper">
          <div className="noticias-header">
            <button onClick={() => navigate('/acesso')} className="back-button">
              ← Voltar
            </button>
            <h2>Notícias e Atualizações</h2>
          </div>

          <div className="filtros-container">
            <p className="filtros-label">Filtrar por categoria:</p>
            <div className="filtros-buttons">
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaFiltro(cat)}
                  className={`filtro-button ${categoriaFiltro === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="loading-text">Carregando notícias...</p>
          ) : noticiasFiltradas.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma notícia encontrada nesta categoria.</p>
            </div>
          ) : (
            <div className="noticias-grid">
              {noticiasFiltradas.map(noticia => (
                <div key={noticia.id} className="noticia-card">
                  <div className="noticia-imagem">
                    <img src={noticia.imagem} alt={noticia.titulo} />
                    <span className="noticia-categoria-badge">{noticia.categoria}</span>
                  </div>
                  <div className="noticia-conteudo">
                    <p className="noticia-data">{noticia.data}</p>
                    <h3>{noticia.titulo}</h3>
                    <p className="noticia-resumo">{noticia.resumo}</p>
                    <button className="ler-mais-button">Ler mais →</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
