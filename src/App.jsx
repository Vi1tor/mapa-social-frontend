import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import Home from "./pages/HomePage.jsx";
import Sobre from "./components/AboutSection/Section.jsx";
import Contato from "./pages/Contato.jsx";
import Login from "./pages/Login.jsx";
import Acesso from "./pages/Acesso";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />
        <Route path="/acesso" element={<Acesso onLogin={(email) => console.log("Logou com:", email)} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

