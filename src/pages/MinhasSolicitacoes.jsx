import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MinhasSolicitacoes.css';

export function MinhasSolicitacoes() {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('TODAS');

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    if (!userId) {
      alert('❌ Você precisa estar logado');
      navigate('/login');
      return;
    }

    carregarSolicitacoes();
  }, [userId, navigate]);

  const carregarSolicitacoes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/solicitacoes/usuario/${userId}`);
      const data = await response.json();
      setSolicitacoes(data);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (solicitacaoId) => {
    if (!confirm('❓ Deseja realmente cancelar esta solicitação?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/solicitacoes/${solicitacaoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('✅ Solicitação cancelada com sucesso');
        carregarSolicitacoes();
      } else {
        const error = await response.json();
        alert(`❌ ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      alert('❌ Erro ao cancelar solicitação');
    }
  };

  const handleNavigate = (endereco) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const encodedAddress = encodeURIComponent(endereco);

    if (isMobile) {
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS) {
        window.location.href = `maps://maps.apple.com/?daddr=${encodedAddress}`;
        setTimeout(() => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
        }, 1500);
      } else {
        window.location.href = `geo:0,0?q=${encodedAddress}`;
        setTimeout(() => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
        }, 1500);
      }
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDENTE':
        return '⏳';
      case 'APROVADA':
        return '✅';
      case 'REJEITADA':
        return '❌';
      case 'CANCELADA':
        return '🚫';
      default:
        return '📋';
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  const solicitacoesFiltradas = solicitacoes.filter(sol => {
    if (filtroStatus === 'TODAS') return true;
    return sol.status === filtroStatus;
  });

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="minhas-solicitacoes-container">
        <div className="loading">⏳ Carregando suas solicitações...</div>
      </div>
    );
  }

  return (
    <div className="minhas-solicitacoes-container">
      <div className="solicitacoes-header">
        <button className="btn-voltar" onClick={() => navigate('/acesso')}>
          ← Voltar
        </button>
        <div>
          <h1>📋 Minhas Solicitações</h1>
          <p className="user-greeting">Olá, <strong>{userName}</strong>!</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtro-group">
          <label>Status:</label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="select-filtro"
          >
            <option value="TODAS">Todas</option>
            <option value="PENDENTE">⏳ Pendentes</option>
            <option value="APROVADA">✅ Aprovadas</option>
            <option value="REJEITADA">❌ Rejeitadas</option>
            <option value="CANCELADA">🚫 Canceladas</option>
          </select>
        </div>

        <div className="resultados-info">
          {solicitacoesFiltradas.length} {solicitacoesFiltradas.length === 1 ? 'solicitação' : 'solicitações'}
        </div>
      </div>

      {/* Lista de Solicitações */}
      {solicitacoesFiltradas.length === 0 ? (
        <div className="no-results">
          <p>📭 Nenhuma solicitação encontrada</p>
          <button className="btn-buscar-servicos" onClick={() => navigate('/servicos')}>
            🔍 Buscar Serviços
          </button>
        </div>
      ) : (
        <div className="solicitacoes-grid">
          {solicitacoesFiltradas.map((sol) => (
            <div key={sol.id} className={`solicitacao-card status-${getStatusClass(sol.status)}`}>
              {/* Header do Card */}
              <div className="card-header">
                <div className="servico-nome">
                  <h3>{sol.servico?.nome || 'Serviço não encontrado'}</h3>
                </div>
                <div className={`status-badge ${getStatusClass(sol.status)}`}>
                  {getStatusIcon(sol.status)} {sol.status}
                </div>
              </div>

              {/* Informações do Serviço */}
              {sol.servico && (
                <div className="card-servico-info">
                  <div className="info-item">
                    <span className="icon">📍</span>
                    <span>{sol.servico.endereco}</span>
                  </div>
                  {sol.servico.telefone && (
                    <div className="info-item">
                      <span className="icon">📞</span>
                      <a href={`tel:${sol.servico.telefone}`}>{sol.servico.telefone}</a>
                    </div>
                  )}
                </div>
              )}

              {/* Observação */}
              <div className="card-observacao">
                <strong>Sua mensagem:</strong>
                <p>{sol.observacao}</p>
              </div>

              {/* Data de Solicitação */}
              <div className="card-data">
                <span className="icon">📅</span>
                Solicitado em: {formatarData(sol.dataSolicitacao)}
              </div>

              {/* Resposta do Admin (se houver) */}
              {sol.respostaAdmin && (
                <div className="card-resposta">
                  <strong>💬 Resposta da Administração:</strong>
                  <p>{sol.respostaAdmin}</p>
                  {sol.dataResposta && (
                    <small>Respondido em: {formatarData(sol.dataResposta)}</small>
                  )}
                </div>
              )}

              {/* Ações */}
              <div className="card-actions">
                {sol.servico && (
                  <button
                    className="btn-navigate-small"
                    onClick={() => handleNavigate(sol.servico.endereco)}
                  >
                    🧭 Como Chegar
                  </button>
                )}
                {sol.status === 'PENDENTE' && (
                  <button
                    className="btn-cancelar-small"
                    onClick={() => handleCancelar(sol.id)}
                  >
                    🚫 Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estatísticas */}
      <div className="estatisticas">
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <strong>{solicitacoes.filter(s => s.status === 'PENDENTE').length}</strong>
            <span>Pendentes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <strong>{solicitacoes.filter(s => s.status === 'APROVADA').length}</strong>
            <span>Aprovadas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <strong>{solicitacoes.filter(s => s.status === 'REJEITADA').length}</strong>
            <span>Rejeitadas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <strong>{solicitacoes.length}</strong>
            <span>Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
