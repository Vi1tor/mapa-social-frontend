import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import "./Cadastro.css";

export function Cadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao criar conta.");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="cadastro-page">
      <Header />

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
              </div>

              {error && <p className="error">{error}</p>}

              <button type="submit" className="submit-button">
                Cadastrar
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

      <Footer />
    </div>
  );
}
