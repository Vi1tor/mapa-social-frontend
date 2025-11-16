import { useState } from "react";
import "./Contato.css";

export function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    mensagem: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
  };

  return (
    <div className="contato-page">
      <main className="contato-main">
        <div className="contato-container">
          <div className="info-section">
            <h2>Prefeitura de Bragança Paulista</h2>

            <div className="info-details">
              <div>
                <h3>Endereço:</h3>
                <p>
                  Av. Antonio Pires Pimentel, 2015 - Centro, Bragança Paulista -
                  SP, 12914-900.
                </p>
              </div>

              <div>
                <h3>Atendimento:</h3>
                <p>Segunda à sexta: 07:00 às 17:00.</p>
                <p>Sábado e Domingo: 09:00 às 15:00.</p>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contate-nos</h3>

            <form onSubmit={handleSubmit} className="contact-form">
              <div>
                <label>Nome</label>
                <input
                  type="text"
                  placeholder="Ana Paula"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label>Telefone</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-0000"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label>E-mail</label>
                <input
                  type="email"
                  placeholder="ana@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label>Mensagem</label>
                <textarea
                  placeholder="Deixe sua mensagem..."
                  value={formData.mensagem}
                  onChange={(e) =>
                    setFormData({ ...formData, mensagem: e.target.value })
                  }
                  rows={6}
                  required
                />
              </div>

              <div className="submit-button-container">
                <button type="submit">ENVIAR</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
