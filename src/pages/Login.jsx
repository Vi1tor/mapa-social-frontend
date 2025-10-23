import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, senha);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Erro ao fazer login");
      }
    } catch (err) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-main">
        <div className="login-wrapper">
          <h2>Faça Login</h2>

          <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="error-message">{error}</div>}

              <div>
                <label>E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label>Senha</label>
                <input
                  type="password"
                  placeholder="******"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="forgot-password">
                <Link to="#" className="forgot-link">
                  Esqueceu a senha?
                </Link>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="create-account">
              <span>Não tem uma conta? </span>
              <Link to="/cadastro" className="create-account-button">
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
