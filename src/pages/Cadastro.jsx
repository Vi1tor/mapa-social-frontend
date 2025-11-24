import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Cadastro.css";

export function Cadastro() {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errs = {};
    if (!formData.nome || formData.nome.trim().length < 3) errs.nome = "Informe seu nome (mínimo 3 caracteres).";
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(formData.email)) errs.email = "E-mail inválido.";
    if (!formData.senha || formData.senha.length < 6) errs.senha = "Senha deve ter ao menos 6 caracteres.";
    if (!formData.confirmarSenha || formData.senha !== formData.confirmarSenha) errs.confirmarSenha = "As senhas não coincidem.";
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
      const response = await fetch(`${API_BASE}/usuarios/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: formData.nome, email: formData.email, senhaHash: formData.senha, tipo: "COMUM" }),
      });

      if (response.ok) {
        navigate("/acesso");
      } else {
        let msg = "Erro ao criar conta.";
        try {
          const data = await response.json();
          if (data && data.message) msg = data.message;
        } catch (_) {}
        setError(msg);
      }
    } catch (err) {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-page">
      <main className="cadastro-main">
        <div className="cadastro-wrapper">
          <h2>Crie sua Conta</h2>

          <div className="cadastro-form-container">
            <form onSubmit={handleSubmit} className="cadastro-form">
              <div>
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.nome && <div className="error">{fieldErrors.nome}</div>}
              </div>

              <div>
                <label>E-mail</label>
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.email && <div className="error">{fieldErrors.email}</div>}
              </div>

              <div>
                <label>Senha</label>
                <input
                  type="password"
                  name="senha"
                  placeholder="******"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.senha && <div className="error">{fieldErrors.senha}</div>}
              </div>

              <div>
                <label>Confirmar senha</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  placeholder="******"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.confirmarSenha && <div className="error">{fieldErrors.confirmarSenha}</div>}
              </div>

              {error && <p className="error">{error}</p>}

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Registrando...' : 'Cadastrar'}
              </button>
            </form>

            <div className="create-account">
              <span>Já tem uma conta? </span>
              <Link to="/login" className="create-account-button">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
