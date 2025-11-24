import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Favoritos.css";

export function Favoritos({ isLoggedIn, userName}) {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setFavoritos([
        { id: 1, nome: "UBS Central", categoria: "Saúde Pública", endereco: "Rua das Flores, 123" },
        { id: 2, nome: "EMEF João Silva", categoria: "Educação Pública", endereco: "Av. Principal, 456" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleRemoveFavorito = (id) => {
    setFavoritos(favoritos.filter(f => f.id !== id));
  };

  return (
    <div className="favoritos-page">
      <main className="favoritos-main">
        <div className="favoritos-wrapper">
          <div className="favoritos-header">
            <button onClick={() => navigate('/acesso')} className="back-button">
              ← Voltar
            </button>
            <h2>Meus Serviços Favoritos</h2>
          </div>

          {loading ? (
            <p className="loading-text">Carregando favoritos...</p>
          ) : favoritos.length === 0 ? (
            <div className="empty-state">
              <p>Você ainda não tem serviços favoritos.</p>
              <button onClick={() => navigate('/map')} className="cta-button">
                Explorar o Mapa
              </button>
            </div>
          ) : (
            <div className="favoritos-list">
              {favoritos.map(fav => (
                <div key={fav.id} className="favorito-card">
                  <div className="favorito-info">
                    <h3>{fav.nome}</h3>
                    <p className="favorito-categoria">{fav.categoria}</p>
                    <p className="favorito-endereco">{fav.endereco}</p>
                  </div>
                  <div className="favorito-actions">
                    <button 
                      onClick={() => navigate('/map')} 
                      className="btn-ver"
                    >
                      Ver no Mapa
                    </button>
                    <button 
                      onClick={() => handleRemoveFavorito(fav.id)} 
                      className="btn-remover"
                    >
                      Remover
                    </button>
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
