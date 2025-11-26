import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServicoSocialCard.css';

export function ServicoSocialCard({ servico, onNavigate }) {
  const navigate = useNavigate();
  const [favoritado, setFavoritado] = useState(false);
  const [loadingFavorito, setLoadingFavorito] = useState(false);
  const userId = localStorage.getItem('userId');
  const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1';
  const API_BASE = rawBase.endsWith('/api/v1') ? rawBase : (rawBase.endsWith('/') ? rawBase + 'api/v1' : rawBase + '/api/v1');

  const handleAdicionarFavorito = async () => {
    if (!userId) {
      alert('⚠️ Faça login para adicionar favoritos');
      navigate('/login');
      return;
    }

    try {
      setLoadingFavorito(true);
      const response = await fetch(`${API_BASE}/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: parseInt(userId),
          servicoSocialId: servico.id
        })
      });

      if (response.ok) {
        setFavoritado(true);
        alert('✅ Serviço adicionado aos favoritos!');
      } else if (response.status === 400) {
        alert('ℹ️ Este serviço já está nos seus favoritos');
      } else {
        throw new Error('Erro ao adicionar favorito');
      }
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      alert('❌ Não foi possível adicionar aos favoritos');
    } finally {
      setLoadingFavorito(false);
    }
  };
  
  const handleNavigate = () => {
    // Detecta se está no mobile para abrir o app nativo de mapas
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const endereco = servico.enderecoResumo || `${servico.rua}, ${servico.numero} - ${servico.bairro}, ${servico.cidade}`;
    const enderecoCompleto = `${endereco}, Bragança Paulista, SP, Brasil`;
    
    if (isMobile) {
      // No mobile, tenta abrir o app nativo (Google Maps ou Apple Maps)
      const iosUrl = `maps://maps.apple.com/?daddr=${encodeURIComponent(enderecoCompleto)}`;
      const androidUrl = `geo:0,0?q=${encodeURIComponent(enderecoCompleto)}`;
      
      // Tenta abrir o app nativo
      if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        window.location.href = iosUrl;
        // Fallback para Google Maps web se não funcionar
        setTimeout(() => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`, '_blank');
        }, 500);
      } else {
        window.location.href = androidUrl;
        setTimeout(() => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`, '_blank');
        }, 500);
      }
    } else {
      // No desktop, abre Google Maps no navegador
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`, '_blank');
    }
    
    if (onNavigate) onNavigate(servico);
  };

  const handleVerNoMapa = () => {
    // Navega internamente (SPA) para evitar 404 em hospedagem sem fallback
    const endereco = servico.enderecoResumo || `${servico.rua}, ${servico.numero}`;
    navigate(`/map?servico=${servico.id}&endereco=${encodeURIComponent(endereco)}`);
  };

  return (
    <div className="servico-social-card">
      <div className="servico-card-header">
        <h3 className="servico-card-title">{servico.nome}</h3>
        {servico.categoriaNome && (
          <span className="servico-card-badge">{servico.categoriaNome}</span>
        )}
      </div>

      <div className="servico-card-body">
        {servico.tipo && (
          <div className="servico-card-info">
            <span className="info-icon">🏢</span>
            <span className="info-text"><strong>Tipo:</strong> {servico.tipo}</span>
          </div>
        )}

        {servico.telefone && (
          <div className="servico-card-info">
            <span className="info-icon">📞</span>
            <span className="info-text">
              <a href={`tel:${servico.telefone}`} className="servico-phone-link">
                {servico.telefone}
              </a>
            </span>
          </div>
        )}

        <div className="servico-card-info">
          <span className="info-icon">📍</span>
          <span className="info-text">{servico.enderecoResumo}</span>
        </div>
      </div>

      <div className="servico-card-actions">
        <button 
          className={`btn-favorito ${favoritado ? 'favoritado' : ''}`}
          onClick={handleAdicionarFavorito}
          disabled={loadingFavorito}
          title={favoritado ? "Já está nos favoritos" : "Adicionar aos favoritos"}
        >
          {loadingFavorito ? '⏳' : (favoritado ? '❤️ Favoritado' : '🤍 Favoritar')}
        </button>
        <button 
          className="btn-solicitar"
          onClick={() => navigate(`/solicitar-servico/${servico.id}`)}
          title="Solicitar este serviço"
        >
          📋 Solicitar
        </button>
        <button 
          className="btn-ver-mapa"
          onClick={handleVerNoMapa}
          title="Ver no mapa do site"
        >
          🗺️ Mapa
        </button>
        <button 
          className="btn-navegar"
          onClick={handleNavigate}
          title="Abrir rotas no Google Maps"
        >
          🧭 Rotas
        </button>
      </div>
    </div>
  );
}
