import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Sugestoes.css";

export function Sugestoes() {
  const navigate = useNavigate();
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('TODOS');
  const [formData, setFormData] = useState({
    nomeServico: "",
    categoria: "",
    endereco: "",
    descricao: ""
  });
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1';
  const API_BASE = rawBase.endsWith('/api/v1') ? rawBase : (rawBase.endsWith('/') ? rawBase + 'api/v1' : rawBase + '/api/v1');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    carregarSugestoes();
  }, []);

  useEffect(() => {
    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      carregarSugestoes();
    }
  }, [selectedStatus, userRole]);

  const carregarSugestoes = async () => {
    try {
      setLoading(true);
      let url;
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        if (selectedStatus && selectedStatus !== 'TODOS') {
          url = `${API_BASE}/admin/sugestoes/status/${selectedStatus}`;
        } else {
          url = `${API_BASE}/admin/sugestoes`;
        }
      } else {
        url = `${API_BASE}/sugestoes/usuario/${userId}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const mapped = (data || []).map(s => ({
        id: s.id,
        nomeServico: s.nomeSugerido,
        categoria: s.categoria || '-',
        endereco: s.enderecoSugerido,
        descricao: s.descricaoSugerida,
        statusOriginal: s.status,
        status: s.status === 'PENDENTE' ? 'Em Análise' : (s.status === 'APROVADO' ? 'Aprovado' : 'Rejeitado'),
        data: s.dataSugestao ? new Date(s.dataSugestao).toLocaleDateString('pt-BR') : '',
        usuarioId: s.usuarioId
      }));
      setSugestoes(mapped);
    } catch (e) {
      console.error('Erro ao carregar sugestões', e);
      setSugestoes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert('Você precisa estar logado para enviar uma sugestão.');
      navigate('/login');
      return;
    }
    try {
      const payload = {
        usuarioId: parseInt(userId),
        nomeSugerido: formData.nomeServico.trim(),
        enderecoSugerido: formData.endereco.trim(),
        descricaoSugerida: formData.descricao.trim(),
        categoria: formData.categoria.trim()
      };
      const res = await fetch(`${API_BASE}/sugestoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      alert('✅ Sugestão enviada! Ela será analisada pela administração.');
      setFormData({ nomeServico: "", categoria: "", endereco: "", descricao: "" });
      setShowForm(false);
      await carregarSugestoes();
    } catch (e) {
      console.error('Erro ao enviar sugestão', e);
      alert('❌ Não foi possível enviar sua sugestão. Tente novamente.');
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "Aprovado": return "status-aprovado";
      case "Rejeitado": return "status-rejeitado";
      default: return "status-analise";
    }
  };

  return (
    <div className="sugestoes-page">
      <main className="sugestoes-main">
        <div className="sugestoes-wrapper">
          <div className="sugestoes-header">
            <button onClick={() => navigate('/acesso')} className="back-button">
              ← Voltar
            </button>
            <h2>{(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') ? 'Todas as Sugestões' : 'Minhas Sugestões'} {userName ? `— ${userName}` : ''}</h2>
            {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
              <div className="status-filter">
                <label htmlFor="statusSelect">Filtrar por status:</label>
                <select
                  id="statusSelect"
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                >
                  <option value="TODOS">Todos</option>
                  <option value="PENDENTE">Pendentes</option>
                  <option value="APROVADO">Aprovados</option>
                  <option value="REJEITADO">Rejeitados</option>
                </select>
              </div>
            )}
            <button onClick={() => setShowForm(!showForm)} className="add-button">
              {showForm ? "Cancelar" : "+ Nova Sugestão"}
            </button>
          </div>

          {showForm && (
            <div className="sugestao-form-container">
              <h3>Sugerir Novo Serviço</h3>
              <form onSubmit={handleSubmit} className="sugestao-form">
                <div className="form-group">
                  <label>Nome do Serviço</label>
                  <input
                    type="text"
                    name="nomeServico"
                    value={formData.nomeServico}
                    onChange={handleChange}
                    placeholder="Ex: UBS Jardim das Flores"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoria</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Educação">Educação</option>
                    <option value="Assistência Social">Assistência Social</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua, número, bairro"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Descreva o serviço social que você conhece..."
                    rows="4"
                    required
                  />
                </div>

                <button type="submit" className="submit-button">
                  Enviar Sugestão
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <p className="loading-text">Carregando sugestões...</p>
          ) : sugestoes.length === 0 ? (
            <div className="empty-state">
              <p>Você ainda não fez nenhuma sugestão.</p>
              <button onClick={() => setShowForm(true)} className="cta-button">
                Fazer Primeira Sugestão
              </button>
            </div>
          ) : (
            <div className="sugestoes-list">
              {sugestoes.map(sug => (
                <div key={sug.id} className="sugestao-card">
                  <div className="sugestao-info">
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'}}>
                      <h3 style={{margin: 0}}>{sug.nomeServico}</h3>
                      <span className={`status-badge ${getStatusClass(sug.status)}`}>
                        {sug.status}
                      </span>
                    </div>
                    <p className="sugestao-categoria">
                      <strong>Categoria:</strong> {sug.categoria}
                    </p>
                    {sug.endereco && (
                      <p className="sugestao-endereco">
                        <strong>📍 Endereço:</strong> {sug.endereco}
                      </p>
                    )}
                    {sug.descricao && (
                      <p className="sugestao-descricao" style={{marginTop: '8px', color: '#555'}}>
                        {sug.descricao}
                      </p>
                    )}
                    <p className="sugestao-data" style={{marginTop: '10px', fontSize: '0.9em', color: '#888'}}>
                      📅 Enviado em: {sug.data}
                    </p>
                    {sug.statusOriginal === 'APROVADO' && (
                      <p style={{marginTop: '8px', color: '#10b981', fontWeight: 'bold'}}>
                        ✅ Sua sugestão foi aprovada e será adicionada ao sistema!
                      </p>
                    )}
                    {sug.statusOriginal === 'REJEITADO' && (
                      <p style={{marginTop: '8px', color: '#ef4444'}}>
                        ❌ Sua sugestão foi rejeitada. Entre em contato para mais informações.
                      </p>
                    )}
                    {sug.statusOriginal === 'PENDENTE' && (
                      <p style={{marginTop: '8px', color: '#f59e0b'}}>
                        ⏳ Sua sugestão está em análise. Aguarde a resposta da administração.
                      </p>
                    )}
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
