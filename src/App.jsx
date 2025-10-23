import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import Sobre from "./components/AboutSection/Section.jsx";
import Contato from "./pages/Contato.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Sugestao from "./pages/Sugestão.jsx";
import Acesso from "./pages/Acesso.jsx";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sugestao" element={<Sugestao />} />
        <Route path="/acesso" element={<Acesso />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
