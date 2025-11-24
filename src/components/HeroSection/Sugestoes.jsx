import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Sugestoes.css";

export function Sugestoes() {
  const navigate = useNavigate();
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nomeServico: "",
    categoria: "",
    endereco: "",
    descricao: ""
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSugestoes([
        { id: 1, nomeServico: "Posto de Saúde Jardim", categoria: "Saúde", status: "Em Análise", data: "10/11/2025" },
        { id: 2, nomeServico: "Biblioteca Comunitária", categoria: "Educação", status: "Aprovado", data: "05/11/2025" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const novaSugestao = {
      id: Date.now(),
      ...formData,
      status: "Em Análise",
      data: new Date().toLocaleDateString('pt-BR')
    };
    setSugestoes([novaSugestao, ...sugestoes]);
    setFormData({ nomeServico: "", categoria: "", endereco: "", descricao: "" });
    setShowForm(false);
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
            <h2>Minhas Sugestões</h2>
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
                    <h3>{sug.nomeServico}</h3>
                    <p className="sugestao-categoria">{sug.categoria}</p>
                    {sug.endereco && <p className="sugestao-endereco">{sug.endereco}</p>}
                    <p className="sugestao-data">Enviado em: {sug.data}</p>
                  </div>
                  <div className="sugestao-status">
                    <span className={`status-badge ${getStatusClass(sug.status)}`}>
                      {sug.status}
                    </span>
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
