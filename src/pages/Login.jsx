import { useState } from "react";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { Link } from "react-router-dom";
import "./Login.css";

export function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    }
  };

  return (
    <div className="login-page">
      <Header />

      <main className="login-main">
        <div className="login-wrapper">
          <h2>Faça Login</h2>

          <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
              <div>
                <label>E-mail</label>
                <input
                  type="email"
                  placeholder="anapaulaa@gmail.com"
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

              <div className="forgot-password">
                <Link to="#" className="forgot-link">
                  Esqueceu a senha?
                </Link>
              </div>

              <button type="submit" className="submit-button">
                Entrar
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
              <Link to="/criar-conta" className="create-account-button">
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
