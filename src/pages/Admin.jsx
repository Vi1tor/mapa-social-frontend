import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin({ isLoggedIn, userName}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [sugestoesPendentes, setSugestoesPendentes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = "http://localhost:8080/admin";


  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (activeTab === "dashboard") {
      fetchEstatisticas();
    } else if (activeTab === "sugestoes") {
      fetchSugestoesPendentes();
    } else if (activeTab === "usuarios") {
      fetchUsuarios();
    }
  }, [activeTab]);

  const fetchEstatisticas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/dashboard/estatisticas`);
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      alert("Erro ao carregar estatísticas. Verifique se o backend está rodando.");
      setStats({ totalUsuarios: 0, totalServicos: 0, totalSugestoesPendentes: 0, totalFavoritos: 0, totalHistoricos: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchSugestoesPendentes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/sugestoes/pendentes`);
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const data = await response.json();
      setSugestoesPendentes(data);
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
      alert("Erro ao carregar sugestões. Verifique se o backend está rodando e você tem permissão de admin.");
      setSugestoesPendentes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      alert("Erro ao carregar usuários. Verifique se o backend está rodando e você tem permissão de admin.");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const aprovarSugestao = async (id) => {
    try {
      const response = await fetch(`${API_URL}/sugestoes/${id}/aprovar`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Sugestão aprovada com sucesso!");
        fetchSugestoesPendentes();
      }
    } catch (error) {
      console.error("Erro ao aprovar sugestão:", error);
    }
  };

  const rejeitarSugestao = async (id) => {
    try {
      const response = await fetch(`${API_URL}/sugestoes/${id}/rejeitar`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Sugestão rejeitada!");
        fetchSugestoesPendentes();
      }
    } catch (error) {
      console.error("Erro ao rejeitar sugestão:", error);
    }
  };

  const excluirUsuario = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Usuário excluído com sucesso!");
        fetchUsuarios();
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2 className="admin-title">🔐 Painel Admin</h2>
        <nav className="admin-nav">
          <button
            className={activeTab === "dashboard" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={activeTab === "sugestoes" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("sugestoes")}
          >
            💡 Sugestões
          </button>
          <button
            className={activeTab === "usuarios" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("usuarios")}
          >
            👥 Usuários
          </button>
          <button
            className={activeTab === "servicos" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("servicos")}
          >
            🏢 Serviços
          </button>
          <button
            className={activeTab === "categorias" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("categorias")}
          >
            🏷️ Categorias
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {loading && <div className="loading">Carregando...</div>}

        {!loading && activeTab === "dashboard" && (
          <div className="dashboard-section">
            <h2>Dashboard - Estatísticas Gerais</h2>
            {!stats && (
              <p className="empty-message">Erro ao carregar dados. Verifique se o backend está rodando.</p>
            )}
            {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsuarios}</h3>
                  <p>Usuários Cadastrados</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-info">
                  <h3>{stats.totalServicos}</h3>
                  <p>Serviços Sociais</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💡</div>
                <div className="stat-info">
                  <h3>{stats.totalSugestoesPendentes}</h3>
                  <p>Sugestões Pendentes</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <h3>{stats.totalFavoritos}</h3>
                  <p>Total de Favoritos</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>{stats.totalHistoricos}</h3>
                  <p>Acessos Registrados</p>
                </div>
              </div>
            </div>
            )}
          </div>
        )}

        {!loading && activeTab === "sugestoes" && (
          <div className="sugestoes-section">
            <h2>Sugestões Pendentes de Aprovação</h2>
            {sugestoesPendentes.length === 0 ? (
              <p className="empty-message">Nenhuma sugestão pendente no momento.</p>
            ) : (
              <div className="sugestoes-list">
                {sugestoesPendentes.map((sugestao) => (
                  <div key={sugestao.id} className="sugestao-card">
                    <div className="sugestao-header">
                      <h3>{sugestao.nomeSugerido}</h3>
                      <span className="badge-pendente">PENDENTE</span>
                    </div>
                    <div className="sugestao-body">
                      <p><strong>Endereço:</strong> {sugestao.enderecoSugerido || "Não informado"}</p>
                      <p><strong>Descrição:</strong> {sugestao.descricaoSugerida || "Sem descrição"}</p>
                      <p className="sugestao-date">
                        Sugerido em: {new Date(sugestao.dataSugestao).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="sugestao-actions">
                      <button
                        className="btn-aprovar"
                        onClick={() => aprovarSugestao(sugestao.id)}
                      >
                        ✓ Aprovar
                      </button>
                      <button
                        className="btn-rejeitar"
                        onClick={() => rejeitarSugestao(sugestao.id)}
                      >
                        ✕ Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === "usuarios" && (
          <div className="usuarios-section">
            <h2>Gerenciar Usuários</h2>
            {usuarios.length === 0 ? (
              <p className="empty-message">Nenhum usuário cadastrado.</p>
            ) : (
              <div className="table-container">
                <table className="usuarios-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Tipo</th>
                      <th>Role</th>
                      <th>Data Cadastro</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.nome}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.tipo}</td>
                        <td>
                          <span className={`badge-role ${usuario.role.toLowerCase()}`}>
                            {usuario.role}
                          </span>
                        </td>
                        <td>{new Date(usuario.dataCadastro).toLocaleDateString("pt-BR")}</td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => excluirUsuario(usuario.id)}
                            disabled={usuario.role === "ADMIN"}
                          >
                            🗑️ Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === "servicos" && (
          <div className="servicos-section">
            <h2>Gerenciar Serviços Sociais</h2>
            <p className="info-message">🚧 Em desenvolvimento - Criar, editar e excluir serviços</p>
          </div>
        )}

        {!loading && activeTab === "categorias" && (
          <div className="categorias-section">
            <h2>Gerenciar Categorias</h2>
            <p className="info-message">🚧 Em desenvolvimento - Criar, editar e excluir categorias</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
