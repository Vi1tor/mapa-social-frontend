import { useState } from "react";
import { Link } from "react-router-dom";
import "./RecuperarSenha.css";

export function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(email)) {
      setError("E-mail inválido.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/usuarios/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess("Um link de recuperação foi enviado ao seu e-mail!");
        setEmail("");
      } else {
        setError("Não foi possível enviar o e-mail.");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recuperar-page">
      <main className="recuperar-main">
        <div className="recuperar-wrapper">

          <div className="recuperar-form-container">
            <h2>Recuperar Senha</h2>
                <form onSubmit={handleSubmit} className="recuperar-form">

                <div>
                    <label>E-mail cadastrado</label>
                    <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar link"}
                </button>
                </form>

            <div className="back-login">
              <span>Voltar para </span>
              <Link to="/login" className="back-login-button">
                Login
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
