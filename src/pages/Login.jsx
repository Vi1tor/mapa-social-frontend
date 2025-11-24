import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("E-mail e senha são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
      const response = await fetch(`${API_BASE}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senhaHash: password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.nome);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userId", data.id);

        if (onLogin) onLogin(data.email);
        
        // Redirecionar baseado no role
        if (data.role === 'ADMIN' || data.role === 'SUPER_ADMIN') {
          navigate("/admin");
        } else {
          navigate("/acesso");
        }
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Credenciais inválidas.");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-main">
        <div className="login-wrapper">
          

          <div className="login-form-container">
            <h2>Faça Login</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <div>
                  <label>E-mail</label>
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

              <div>
                <label>Senha</label>
                <input
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="error" style={{color: 'red', marginTop: '10px'}}>{error}</p>}

              <div className="forgot-password">
                <Link to="/recuperar-senha" className="forgot-link">
                  Esqueceu a senha?
                </Link>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="divider">
              <span>Ou</span>
            </div>

            <div className="social-buttons">
              <button className="social-button google">
                <span>G</span> Faça login com Google
              </button>
              <button className="social-button x">
                <span>𝕏</span> Faça login com X
              </button>
            </div>

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
