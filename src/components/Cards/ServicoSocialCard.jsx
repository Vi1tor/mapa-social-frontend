import React from 'react';
import './ServicoSocialCard.css';

export function ServicoSocialCard({ servico, onNavigate }) {
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
    // Abre o mapa no site mesmo, focando nesse serviço
    const endereco = servico.enderecoResumo || `${servico.rua}, ${servico.numero}`;
    window.open(`/map?servico=${servico.id}&endereco=${encodeURIComponent(endereco)}`, '_blank');
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
          className="btn-ver-mapa"
          onClick={handleVerNoMapa}
          title="Ver no mapa do site"
        >
          🗺️ Ver no Mapa
        </button>
        <button 
          className="btn-navegar"
          onClick={handleNavigate}
          title="Abrir rotas no Google Maps"
        >
          🧭 Como Chegar
        </button>
      </div>
    </div>
  );
}
