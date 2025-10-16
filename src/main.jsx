import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import { Sobre } from "./pages/Sobre";
import { Contato } from "./pages/Contato";
import { Login } from "./pages/Login";



function App() {
  return (
    <BrowserRouter>

      {/* Conteúdo principal */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
