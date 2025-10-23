import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sugestaoService } from "../services/api";
import "./Sugest�o.css";

export default function Sugestao() {
  const [formData, setFormData] = useState({
    nomeServico: "",
    categoriaSugerida: "",
    descricao: "",
    endereco: "",
    contato: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      if (isAuthenticated) {
        await sugestaoService.criar(formData);
      } else {
        await sugestaoService.criarAnonima(formData);
      }

      setSuccess(true);
      setFormData({
        nomeServico: "",
        categoriaSugerida: "",
        descricao: "",
        endereco: "",
        contato: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Erro ao enviar sugest�o. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sugestao-page">
      <main className="sugestao-main">
        <div className="sugestao-wrapper">
          <h2>Sugerir Novo Servi�o</h2>
          <p className="sugestao-description">
            Conhece um servi�o social que n�o est� no mapa? Ajude a comunidade compartilhando!
          </p>

          <div className="sugestao-form-container">
            <form onSubmit={handleSubmit} className="sugestao-form">
              {success && (
                <div className="success-message">
                  Sugest�o enviada com sucesso! Obrigado pela contribui��o.
                </div>
              )}
              {error && <div className="error-message">{error}</div>}

              <div>
                <label>Nome do Servi�o *</label>
                <input
                  type="text"
                  name="nomeServico"
                  placeholder="Ex: UBS Vila Nova"
                  value={formData.nomeServico}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label>Categoria *</label>
                <select
                  name="categoriaSugerida"
                  value={formData.categoriaSugerida}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Sa�de P�blica">Sa�de P�blica</option>
                  <option value="Educa��o P�blica">Educa��o P�blica</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Alimenta��o">Alimenta��o</option>
                  <option value="Cursos Profissionalizantes">Cursos Profissionalizantes</option>
                  <option value="Emiss�o de Documentos">Emiss�o de Documentos</option>
                  <option value="Transporte P�blico">Transporte P�blico</option>
                  <option value="Moradia">Moradia</option>
                  <option value="Assist�ncia Social">Assist�ncia Social</option>
                </select>
              </div>

              <div>
                <label>Descri��o *</label>
                <textarea
                  name="descricao"
                  placeholder="Descreva o servi�o e como ele pode ajudar a comunidade"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows="4"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label>Endere�o</label>
                <input
                  type="text"
                  name="endereco"
                  placeholder="Rua, n�mero, bairro"
                  value={formData.endereco}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label>Contato</label>
                <input
                  type="text"
                  name="contato"
                  placeholder="Telefone, email ou site"
                  value={formData.contato}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Sugest�o"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
