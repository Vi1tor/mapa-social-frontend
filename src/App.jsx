import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import { Sobre } from "./components/AboutSection/Sobre.jsx";
import { Contato } from "./components/FAQ/Contato.jsx";
import { Login } from "./pages/Login.jsx";
import { Acesso } from "./pages/Acesso";
import { Cadastro } from "./pages/Cadastro.jsx";
import MapPage from "./pages/Map.jsx";
import { Favoritos } from "./pages/Favoritos.jsx";
import { Sugestoes } from "./components/HeroSection/Sugestoes.jsx";
import { Noticias } from "./pages/Noticias.jsx";
import Admin from "./pages/Admin.jsx";
import  {RecuperarSenha}  from "./pages/RecuperarSenha.jsx";
import { ServicosLista } from "./pages/ServicosLista.jsx";
import { SolicitarServico } from "./pages/SolicitarServico.jsx";
import { MinhasSolicitacoes } from "./pages/MinhasSolicitacoes.jsx";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("Usuário");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const handleLogin = (email) => {
    setUserEmail(email);
    const name = email.split('@')[0];
    setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setUserEmail("");
    setUserName("Usuário");
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
  };
 
  console.log('App component rendering');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      <Router>
        <Header isLoggedIn={isLoggedIn} onLogin={handleLogin} userName={userName} onLogout={handleLogout} />
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/acesso" element={<Acesso isLoggedIn={isLoggedIn} userName={userName}/>} />
            <Route path="/cadastro" element={<Cadastro isLoggedIn={isLoggedIn}/>} />
            <Route path="/map" element={<MapPage isLoggedIn={isLoggedIn}/>} />
            <Route path="/favoritos" element={<Favoritos isLoggedIn={isLoggedIn}/>} />
            <Route path="/sugestoes" element={<Sugestoes />} />
            <Route path="/noticias" element={<Noticias isLoggedIn={isLoggedIn}/>} />
            <Route path="/servicos" element={<ServicosLista />} />
            <Route path="/solicitar-servico/:id" element={<SolicitarServico />} />
            <Route path="/minhas-solicitacoes" element={<MinhasSolicitacoes />} />
            <Route path="/admin" element={<Admin isLoggedIn={isLoggedIn}/>} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

