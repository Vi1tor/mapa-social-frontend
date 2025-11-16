import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import { Sobre } from "./pages/Sobre.jsx";
import { Contato } from "./pages/Contato.jsx";
import { Login } from "./pages/Login.jsx";
import { Acesso } from "./pages/Acesso";
import { Cadastro } from "./pages/Cadastro.jsx";
import MapPage from "./pages/Map.jsx";
import { Favoritos } from "./pages/Favoritos.jsx";
import { Sugestoes } from "./pages/Sugestoes.jsx";
import { Noticias } from "./pages/Noticias.jsx";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("Usuário");

  const handleLogin = (email) => {
    setUserEmail(email);
    const name = email.split('@')[0];
    setUserName(name.charAt(0).toUpperCase() + name.slice(1));
  };

  const handleLogout = () => {
    setUserEmail("");
    setUserName("Usuário");
  };

  console.log('App component rendering');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      <Router>
        <Header isLoggedIn={!!userEmail} userName={userName} onLogout={handleLogout} />
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/acesso" element={<Acesso onLogin={handleLogin} userName={userName} />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/sugestoes" element={<Sugestoes />} />
            <Route path="/noticias" element={<Noticias />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

