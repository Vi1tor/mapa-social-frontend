import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Cadastro.css";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas n�o coincidem");
      return;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter no m�nimo 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone,
      });

      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Erro ao criar conta");
      }
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-page">
      <main className="cadastro-main">
        <div className="cadastro-wrapper">
          <h2>Criar Conta</h2>

          <div className="cadastro-form-container">
            <form onSubmit={handleSubmit} className="cadastro-form">
              {error && <div className="error-message">{error}</div>}

              <div>
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label>E-mail</label>
                <input
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label>Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  placeholder="(11) 98765-4321"
                  value={formData.telefone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label>Senha</label>
                <input
                  type="password"
                  name="senha"
                  placeholder="M�nimo 6 caracteres"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label>Confirmar Senha</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  placeholder="Confirme sua senha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Criando conta..." : "Criar Conta"}
              </button>
            </form>

            <div className="login-link">
              <span>J� tem uma conta? </span>
              <Link to="/login" className="login-button">
                Fazer Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
