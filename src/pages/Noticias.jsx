import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Noticias.css";

export function Noticias({ isLoggedIn }) {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1';
  const API_BASE = rawBase.endsWith('/api/v1') ? rawBase : (rawBase.endsWith('/') ? rawBase + 'api/v1' : rawBase + '/api/v1');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    carregarNoticias();
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      carregarNoticias();
    }
  }, [categoriaFiltro]);

  const carregarNoticias = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/noticias`;
      
      if (categoriaFiltro && categoriaFiltro !== "Todas") {
        url = `${API_BASE}/noticias/categoria/${encodeURIComponent(categoriaFiltro)}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const mapped = (data || []).map(n => ({
        id: n.id,
        titulo: n.titulo,
        categoria: n.categoria,
        resumo: n.resumo,
        conteudo: n.conteudo,
        data: n.dataPublicacao ? new Date(n.dataPublicacao).toLocaleDateString('pt-BR') : '',
        imagem: n.urlImagem || "/assets/images/default.png"
      }));
      setNoticias(mapped);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      setNoticias([]);
    } finally {
      setLoading(false);
    }
  };

  const categorias = ["Todas", "Saúde", "Educação", "Assistência Social", "Lazer"];

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
          ) : noticias.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma notícia encontrada nesta categoria.</p>
            </div>
          ) : (
            <div className="noticias-grid">
              {noticias.map(noticia => (
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
