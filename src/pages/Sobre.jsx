import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { Link } from "react-router-dom";
import "./Sobre.css";

export function Sobre() {
  return (
    <div className="sobre-page">
      <Header currentPage="sobre" />

      <main className="sobre-main">
        {/* Intro Section */}
        <section className="intro-section">
          <h2 className="intro-title">
            Seja bem-vindo ao Mapa Social.
          </h2>

          <div className="intro-grid">
            <div className="intro-text">
              <h3 className="intro-subtitle">
                Somos uma plataforma de mapa interativo, que conecta pessoas e serviços sociais gratuitos!
              </h3>

              <div className="intro-paragraphs">
                <p>
                  <strong>
                    Nosso propósito é fortalecer redes de apoio, reduzir desigualdades e promover
                    a inclusão social por meio da tecnologia.
                  </strong>
                </p>

                <p>
                  A plataforma é aberta a todos e não é necessário login para buscar serviços. A
                  informação é pública, acessível e pensada para quem mais precisa.
                </p>

                <div className="intro-link">
                  <p>
                    <strong>
                      Navegue no Mapa Social clicando{" "}
                      <Link to="/" className="highlight-link">AQUI</Link>.
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="intro-image-container">
              <div className="image-card">
                <img
                  src="src/assets/images/Pessoas-Mapa.png"
                  alt="Ilustração de pessoas usando o mapa social"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Porque existimos Section */}
        <section className="why-section">
          <div className="why-grid">
            

            <div className="why-text">
              <h3 className="why-title">Porque existimos?</h3>

              <div className="why-paragraphs">
                <p>
                  <strong>
                    Milhões de brasileiros ainda têm dificuldade em acessar saúde, alimentação, abrigo e apoio
                    social não por falta de oferta, mas por falta de informação centralizada.
                  </strong>
                </p>

                <p>
                  O Mapa de Serviços Sociais Gratuitos nasceu para mudar isso: uma plataforma aberta,
                  interativa e georreferenciada, onde qualquer pessoa pode encontrar rapidamente serviços
                  gratuitos na sua região.
                </p>

                <p>
                  Sem necessidade de cadastro, você pode filtrar por categoria e acessar endereço, horário e
                  contatos de cada ponto de atendimento.
                </p>
              </div>
            </div>

            <div className="why-image-container">
              <div className="image-card">
                <img
                  src="src/assets/images/Mapa3d.png"
                  alt="Ilustração de mapa 3D"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nosso Objetivo Section */}
        <section className="objective-section">
          <div className="objective-grid">
            <div className="objective-text">
              <h3 className="objective-title">Nosso Objetivo</h3>

              <div className="objective-paragraphs">
                <p>
                  Mais do que um mapa, este é um espaço colaborativo. A própria comunidade pode indicar novos serviços,
                  que passam por curadoria de administradores para garantir dados sempre atualizados, confiáveis e úteis
                  para quem mais precisa.
                </p>

                <p>
                  Acreditamos que a tecnologia deve ser uma ponte, nunca uma barreira. Por isso, desenvolvemos uma
                  plataforma de uso simples, acessível e inclusiva, pensada especialmente para pessoas em situação de
                  vulnerabilidade social.
                </p>

                <p>
                  <strong>
                    Nosso objetivo é claro: reduzir barreiras de informação, fortalecer redes de apoio, estimular a
                    participação cidadã e promover equidade e inclusão. E tudo isso sem necessidade de cadastro.
                  </strong>
                </p>
              </div>
            </div>

            <div className="objective-image-container">
              <div className="image-card">
                <img
                  src="src/assets/images/Menina-Notebook.png"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
