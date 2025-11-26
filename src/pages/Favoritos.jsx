import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Favoritos.css";

export function Favoritos({ isLoggedIn }) {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1';
  const API_BASE = rawBase.endsWith('/api/v1') ? rawBase : (rawBase.endsWith('/') ? rawBase + 'api/v1' : rawBase + '/api/v1');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    if (!userId) {
      setLoading(false);
      return;
    }

    carregarFavoritos();
  }, [userId, isLoggedIn]);

  const carregarFavoritos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/favoritos/usuario/${userId}`);
      
      if (response.status === 204) {
        setFavoritos([]);
        return;
      }
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const mapped = (data || []).map(f => ({
        id: f.id,
        servicoId: f.servicoSocial?.id,
        nome: f.servicoSocial?.nome || 'Serviço',
        categoria: f.servicoSocial?.categoria?.nome || '-',
        endereco: f.servicoSocial?.endereco 
          ? `${f.servicoSocial.endereco.rua}, ${f.servicoSocial.endereco.numero}` 
          : 'Endereço não disponível'
      }));
      setFavoritos(mapped);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setFavoritos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorito = async (favoritoId, servicoId) => {
    if (!confirm('Deseja realmente remover este favorito?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/favoritos/usuario/${userId}/servico/${servicoId}`, {
        method: 'DELETE'
      });
      
      if (response.ok || response.status === 204) {
        setFavoritos(favoritos.filter(f => f.id !== favoritoId));
        alert('✅ Favorito removido com sucesso!');
      } else {
        throw new Error('Erro ao remover favorito');
      }
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      alert('❌ Não foi possível remover o favorito.');
    }
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
                      onClick={() => handleRemoveFavorito(fav.id, fav.servicoId)} 
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
