import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './SolicitarServico.css';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function SolicitarServico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servico, setServico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [observacao, setObservacao] = useState('');
  const [enviando, setEnviando] = useState(false);

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    if (!userId) {
      alert('❌ Você precisa estar logado para solicitar um serviço');
      navigate('/login');
      return;
    }

    fetch(`http://localhost:8080/servicos/${id}`)
      .then(res => res.json())
      .then(data => {
        setServico(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar serviço:', error);
        setLoading(false);
      });
  }, [id, userId, navigate]);

  const handleSolicitar = async () => {
    if (!observacao.trim()) {
      alert('Por favor, informe o motivo da sua solicitação');
      return;
    }

    setEnviando(true);

    try {
      const response = await fetch('http://localhost:8080/solicitacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: parseInt(userId),
          servicoSocialId: parseInt(id),
          observacao: observacao.trim()
        }),
      });

      if (response.ok) {
        alert('✅ Solicitação enviada com sucesso! Você será notificado quando for analisada.');
        navigate('/minhas-solicitacoes');
      } else {
        const error = await response.json();
        alert(`❌ Erro ao enviar solicitação: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const handleNavigate = () => {
    const address = servico.endereco;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const encodedAddress = encodeURIComponent(address);

    if (isMobile) {
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS) {
        const iosUrl = `maps://maps.apple.com/?daddr=${encodedAddress}`;
        window.location.href = iosUrl;
        setTimeout(() => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
        }, 1500);
      } else {
        const androidUrl = `geo:0,0?q=${encodedAddress}`;
        window.location.href = androidUrl;
        setTimeout(() => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
        }, 1500);
      }
    } else {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="solicitar-servico-container">
        <div className="loading">⏳ Carregando informações do serviço...</div>
      </div>
    );
  }

  if (!servico) {
    return (
      <div className="solicitar-servico-container">
        <div className="error">❌ Serviço não encontrado</div>
      </div>
    );
  }

  return (
    <div className="solicitar-servico-container">
      <div className="solicitar-servico-header">
        <button className="btn-voltar" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        <h1>📋 Solicitar Serviço Social</h1>
      </div>

      <div className="solicitar-servico-content">
        {/* Informações do Serviço */}
        <div className="servico-info-card">
          <div className="servico-header">
            <h2>{servico.nome}</h2>
            <span className="categoria-badge">{servico.categoria}</span>
          </div>

          <div className="servico-details">
            <div className="detail-item">
              <span className="icon">🏢</span>
              <div>
                <strong>Endereço:</strong>
                <p>{servico.endereco}</p>
              </div>
            </div>

            {servico.telefone && (
              <div className="detail-item">
                <span className="icon">📞</span>
                <div>
                  <strong>Telefone:</strong>
                  <a href={`tel:${servico.telefone}`}>{servico.telefone}</a>
                </div>
              </div>
            )}

            {servico.descricao && (
              <div className="detail-item">
                <span className="icon">📝</span>
                <div>
                  <strong>Descrição:</strong>
                  <p>{servico.descricao}</p>
                </div>
              </div>
            )}
          </div>

          <button className="btn-navigate" onClick={handleNavigate}>
            🧭 Como Chegar
          </button>
        </div>

        {/* Mapa com Localização */}
        {servico.latitude && servico.longitude && (
          <div className="mapa-localizacao">
            <h3>📍 Localização</h3>
            <MapContainer
              center={[servico.latitude, servico.longitude]}
              zoom={15}
              style={{ height: '300px', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={[servico.latitude, servico.longitude]}>
                <Popup>
                  <strong>{servico.nome}</strong><br />
                  {servico.endereco}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Formulário de Solicitação */}
        <div className="solicitacao-form">
          <h3>✍️ Motivo da Solicitação</h3>
          <p className="form-descricao">
            Olá, <strong>{userName}</strong>! Por favor, descreva brevemente o motivo da sua solicitação para este serviço.
          </p>

          <textarea
            className="textarea-observacao"
            placeholder="Ex: Preciso de atendimento para cadastro no programa de auxílio habitação..."
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            rows={6}
            maxLength={1000}
          />

          <div className="form-footer">
            <span className="char-count">{observacao.length}/1000 caracteres</span>
          </div>

          <div className="form-actions">
            <button
              className="btn-cancelar"
              onClick={() => navigate(-1)}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              className="btn-solicitar"
              onClick={handleSolicitar}
              disabled={enviando || !observacao.trim()}
            >
              {enviando ? '⏳ Enviando...' : '✅ Confirmar Solicitação'}
            </button>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="info-adicional">
          <h4>ℹ️ Informações Importantes</h4>
          <ul>
            <li>Sua solicitação será analisada pela equipe administrativa</li>
            <li>Você receberá uma resposta em até 48 horas úteis</li>
            <li>Acompanhe o status na página "Minhas Solicitações"</li>
            <li>Em caso de dúvidas, entre em contato pelo telefone do serviço</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
