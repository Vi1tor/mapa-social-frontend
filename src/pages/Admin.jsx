import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin({ isLoggedIn, userName}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [sugestoesPendentes, setSugestoesPendentes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [noticiaForm, setNoticiaForm] = useState({ titulo: '', categoria: '', resumo: '', conteudo: '', urlImagem: '' });
  const [editandoNoticia, setEditandoNoticia] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const rawBase = import.meta.env.VITE_API_BASE || "http://localhost:8080/api/v1";
  const API_BASE = rawBase.endsWith("/api/v1") ? rawBase : (rawBase.endsWith("/") ? rawBase + "api/v1" : rawBase + "/api/v1");
  const API_URL = `${API_BASE}/admin`;
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const isAdmin = userRole === 'ADMIN' || isSuperAdmin;


  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Verificar se tem permissão de admin
    if (!isAdmin) {
      alert("❌ Acesso negado! Apenas administradores podem acessar esta página.");
      navigate("/acesso");
      return;
    }

    if (activeTab === "dashboard") {
      fetchEstatisticas();
    } else if (activeTab === "sugestoes") {
      fetchSugestoesPendentes();
    } else if (activeTab === "usuarios") {
      fetchUsuarios();
    } else if (activeTab === "noticias") {
      fetchNoticias();
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
      const response = await fetch(`${API_URL}/usuarios/${id}?adminId=${userId}`, {
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

  const promoverParaAdmin = async (id) => {
    if (!isSuperAdmin) {
      alert("❌ Apenas SUPER_ADMIN pode promover usuários para ADMIN");
      return;
    }
    
    if (!confirm("Promover este usuário para ADMINISTRADOR?")) return;

    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/promover?adminId=${userId}`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Usuário promovido para ADMIN!");
        fetchUsuarios();
      } else {
        const data = await response.json();
        alert(data.message || "Erro ao promover usuário");
      }
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      alert("Erro ao promover usuário");
    }
  };

  const rebaixarParaUser = async (id) => {
    if (!isSuperAdmin) {
      alert("❌ Apenas SUPER_ADMIN pode rebaixar ADMIN");
      return;
    }
    
    if (!confirm("Rebaixar este administrador para USUÁRIO COMUM?")) return;

    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/rebaixar?adminId=${userId}`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Usuário rebaixado para USER!");
        fetchUsuarios();
      } else {
        const data = await response.json();
        alert(data.message || "Erro ao rebaixar usuário");
      }
    } catch (error) {
      console.error("Erro ao rebaixar usuário:", error);
      alert("Erro ao rebaixar usuário");
    }
  };

  const bloquearUsuario = async (id) => {
    if (!confirm("Bloquear acesso deste usuário?")) return;

    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/bloquear?adminId=${userId}`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Usuário bloqueado!");
        fetchUsuarios();
      } else {
        const data = await response.json();
        alert(data.message || "Erro ao bloquear usuário");
      }
    } catch (error) {
      console.error("Erro ao bloquear usuário:", error);
      alert("Erro ao bloquear usuário");
    }
  };

  const desbloquearUsuario = async (id) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/desbloquear`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Usuário desbloqueado!");
        fetchUsuarios();
      }
    } catch (error) {
      console.error("Erro ao desbloquear usuário:", error);
    }
  };

  const criarNovoUsuario = async (nome, email, senha) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/criar?adminId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, tipo: "COMUM" }),
      });
      
      if (response.ok) {
        alert("✅ Usuário criado com sucesso!");
        fetchUsuarios();
      } else {
        const data = await response.json();
        alert("❌ Erro: " + (data.message || "Não foi possível criar o usuário"));
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert("❌ Erro ao criar usuário");
    }
  };

  const fetchNoticias = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/noticias`);
      if (response.ok) {
        const data = await response.json();
        setNoticias(data);
      }
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      alert("Erro ao carregar notícias");
    } finally {
      setLoading(false);
    }
  };

  const salvarNoticia = async () => {
    const { titulo, categoria, resumo, conteudo, urlImagem } = noticiaForm;
    
    if (!titulo || !categoria || !resumo) {
      alert("❌ Título, categoria e resumo são obrigatórios");
      return;
    }

    try {
      const url = editandoNoticia 
        ? `${API_BASE}/noticias/${editandoNoticia}` 
        : `${API_BASE}/noticias`;
      
      const response = await fetch(url, {
        method: editandoNoticia ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, categoria, resumo, conteudo, urlImagem })
      });

      if (response.ok) {
        alert(editandoNoticia ? "✅ Notícia atualizada!" : "✅ Notícia criada!");
        setNoticiaForm({ titulo: '', categoria: '', resumo: '', conteudo: '', urlImagem: '' });
        setEditandoNoticia(null);
        fetchNoticias();
      } else {
        alert("❌ Erro ao salvar notícia");
      }
    } catch (error) {
      console.error("Erro ao salvar notícia:", error);
      alert("❌ Erro ao salvar notícia");
    }
  };

  const editarNoticia = (noticia) => {
    setNoticiaForm({
      titulo: noticia.titulo,
      categoria: noticia.categoria,
      resumo: noticia.resumo,
      conteudo: noticia.conteudo || '',
      urlImagem: noticia.urlImagem || ''
    });
    setEditandoNoticia(noticia.id);
  };

  const deletarNoticia = async (id) => {
    if (!confirm("Deseja realmente excluir esta notícia?")) return;
    
    try {
      const response = await fetch(`${API_BASE}/noticias/${id}`, { method: "DELETE" });
      if (response.ok) {
        alert("✅ Notícia excluída!");
        fetchNoticias();
      }
    } catch (error) {
      console.error("Erro ao excluir notícia:", error);
      alert("❌ Erro ao excluir notícia");
    }
  };

  const toggleAtivaNoticia = async (id, ativa) => {
    try {
      const action = ativa ? 'desativar' : 'ativar';
      const response = await fetch(`${API_BASE}/noticias/${id}/${action}`, { method: "POST" });
      if (response.ok) {
        alert(`✅ Notícia ${ativa ? 'desativada' : 'ativada'}!`);
        fetchNoticias();
      }
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("❌ Erro ao alterar status da notícia");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2 className="admin-title">
          {isSuperAdmin ? '🔱 Painel SUPER ADMIN' : '🔐 Painel Admin'}
        </h2>
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
          <button
            className={activeTab === "noticias" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("noticias")}
          >
            📰 Notícias
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {loading && <div className="loading">Carregando...</div>}

        {!loading && activeTab === "dashboard" && (
          <div className="dashboard-section">
            <div className="role-info-banner" style={{
              padding: '15px 20px',
              marginBottom: '20px',
              borderRadius: '8px',
              backgroundColor: isSuperAdmin ? '#fef3c7' : '#dbeafe',
              borderLeft: `4px solid ${isSuperAdmin ? '#f59e0b' : '#3b82f6'}`
            }}>
              <h3 style={{margin: 0, fontSize: '18px', fontWeight: 'bold'}}>
                {isSuperAdmin ? '🔱 Nível de Acesso: SUPER ADMINISTRADOR' : '👑 Nível de Acesso: ADMINISTRADOR'}
              </h3>
              <p style={{margin: '5px 0 0 0', fontSize: '14px', color: '#666'}}>
                {isSuperAdmin 
                  ? 'Você tem controle total sobre ADMINISTRADORES e USUÁRIOS. Pode promover, rebaixar, bloquear e excluir.'
                  : 'Você tem controle sobre USUÁRIOS. Pode bloquear e excluir usuários comuns.'}
              </p>
            </div>
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
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2>Gerenciar Usuários</h2>
              <button 
                className="btn-promover"
                onClick={() => {
                  const nome = prompt("Nome do novo usuário:");
                  if (!nome) return;
                  const email = prompt("Email:");
                  if (!email) return;
                  const senha = prompt("Senha (mínimo 6 caracteres):");
                  if (!senha || senha.length < 6) {
                    alert("Senha deve ter ao menos 6 caracteres");
                    return;
                  }
                  criarNovoUsuario(nome, email, senha);
                }}
                style={{padding: '10px 20px'}}
              >
                ➕ Criar Novo Usuário
              </button>
            </div>
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
                      <th>Status</th>
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
                            {usuario.role === "SUPER_ADMIN" && "🔱 SUPER ADMIN"}
                            {usuario.role === "ADMIN" && "👑 ADMIN"}
                            {usuario.role === "USER" && "👤 USER"}
                          </span>
                        </td>
                        <td>
                          {usuario.bloqueado ? (
                            <span className="badge-bloqueado">🚫 BLOQUEADO</span>
                          ) : (
                            <span className="badge-ativo">✅ ATIVO</span>
                          )}
                        </td>
                        <td>{new Date(usuario.dataCadastro).toLocaleDateString("pt-BR")}</td>
                        <td className="action-buttons">
                          {/* SUPER_ADMIN tem controle total sobre ADMIN e USER */}
                          {isSuperAdmin && (
                            <>
                              {usuario.role === "USER" && (
                                <>
                                  <button
                                    className="btn-promover"
                                    onClick={() => promoverParaAdmin(usuario.id)}
                                    title="Promover para Admin"
                                  >
                                    ⬆️ Promover ADMIN
                                  </button>
                                  {!usuario.bloqueado ? (
                                    <button
                                      className="btn-bloquear"
                                      onClick={() => bloquearUsuario(usuario.id)}
                                      title="Bloquear Usuário"
                                    >
                                      🚫 Bloquear
                                    </button>
                                  ) : (
                                    <button
                                      className="btn-desbloquear"
                                      onClick={() => desbloquearUsuario(usuario.id)}
                                      title="Desbloquear Usuário"
                                    >
                                      ✅ Desbloquear
                                    </button>
                                  )}
                                  <button
                                    className="btn-delete"
                                    onClick={() => excluirUsuario(usuario.id)}
                                    title="Excluir Usuário"
                                  >
                                    🗑️ Excluir
                                  </button>
                                </>
                              )}
                              {usuario.role === "ADMIN" && (
                                <>
                                  <button
                                    className="btn-rebaixar"
                                    onClick={() => rebaixarParaUser(usuario.id)}
                                    title="Rebaixar para User"
                                  >
                                    ⬇️ Rebaixar USER
                                  </button>
                                  {!usuario.bloqueado ? (
                                    <button
                                      className="btn-bloquear"
                                      onClick={() => bloquearUsuario(usuario.id)}
                                      title="Bloquear Admin"
                                    >
                                      🚫 Bloquear
                                    </button>
                                  ) : (
                                    <button
                                      className="btn-desbloquear"
                                      onClick={() => desbloquearUsuario(usuario.id)}
                                      title="Desbloquear Admin"
                                    >
                                      ✅ Desbloquear
                                    </button>
                                  )}
                                  <button
                                    className="btn-delete"
                                    onClick={() => excluirUsuario(usuario.id)}
                                    title="Excluir Admin"
                                  >
                                    🗑️ Excluir
                                  </button>
                                </>
                              )}
                              {usuario.role === "SUPER_ADMIN" && (
                                <span className="super-admin-badge">🛡️ PROTEGIDO</span>
                              )}
                            </>
                          )}

                          {/* ADMIN tem controle apenas sobre USER */}
                          {!isSuperAdmin && isAdmin && (
                            <>
                              {usuario.role === "USER" && (
                                <>
                                  {!usuario.bloqueado ? (
                                    <button
                                      className="btn-bloquear"
                                      onClick={() => bloquearUsuario(usuario.id)}
                                      title="Bloquear Usuário"
                                    >
                                      🚫 Bloquear
                                    </button>
                                  ) : (
                                    <button
                                      className="btn-desbloquear"
                                      onClick={() => desbloquearUsuario(usuario.id)}
                                      title="Desbloquear Usuário"
                                    >
                                      ✅ Desbloquear
                                    </button>
                                  )}
                                  <button
                                    className="btn-delete"
                                    onClick={() => excluirUsuario(usuario.id)}
                                    title="Excluir Usuário"
                                  >
                                    🗑️ Excluir
                                  </button>
                                </>
                              )}
                              {usuario.role === "ADMIN" && (
                                <span className="super-admin-badge">👑 ADMIN</span>
                              )}
                              {usuario.role === "SUPER_ADMIN" && (
                                <span className="super-admin-badge">🔱 SUPER ADMIN</span>
                              )}
                            </>
                          )}
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

        {!loading && activeTab === "noticias" && (
          <div className="noticias-section">
            <h2>📰 Gerenciar Notícias</h2>
            
            <div className="form-container" style={{
              background: '#f8fafc',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '2px solid #e2e8f0'
            }}>
              <h3>{editandoNoticia ? '✏️ Editar Notícia' : '➕ Nova Notícia'}</h3>
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={noticiaForm.titulo}
                  onChange={(e) => setNoticiaForm({...noticiaForm, titulo: e.target.value})}
                  placeholder="Título da notícia"
                  style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}}
                />
              </div>
              <div className="form-group">
                <label>Categoria *</label>
                <select
                  value={noticiaForm.categoria}
                  onChange={(e) => setNoticiaForm({...noticiaForm, categoria: e.target.value})}
                  style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}}
                >
                  <option value="">Selecione...</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Educação">Educação</option>
                  <option value="Assistência Social">Assistência Social</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>
              <div className="form-group">
                <label>Resumo *</label>
                <textarea
                  value={noticiaForm.resumo}
                  onChange={(e) => setNoticiaForm({...noticiaForm, resumo: e.target.value})}
                  placeholder="Resumo da notícia (máx 500 caracteres)"
                  rows="3"
                  maxLength="500"
                  style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}}
                />
              </div>
              <div className="form-group">
                <label>Conteúdo</label>
                <textarea
                  value={noticiaForm.conteudo}
                  onChange={(e) => setNoticiaForm({...noticiaForm, conteudo: e.target.value})}
                  placeholder="Conteúdo completo da notícia"
                  rows="6"
                  style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}}
                />
              </div>
              <div className="form-group">
                <label>URL da Imagem</label>
                <input
                  type="text"
                  value={noticiaForm.urlImagem}
                  onChange={(e) => setNoticiaForm({...noticiaForm, urlImagem: e.target.value})}
                  placeholder="/assets/images/noticia.png"
                  style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}}
                />
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button 
                  onClick={salvarNoticia}
                  style={{
                    padding: '12px 24px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {editandoNoticia ? '💾 Salvar Alterações' : '➕ Criar Notícia'}
                </button>
                {editandoNoticia && (
                  <button 
                    onClick={() => {
                      setEditandoNoticia(null);
                      setNoticiaForm({ titulo: '', categoria: '', resumo: '', conteudo: '', urlImagem: '' });
                    }}
                    style={{
                      padding: '12px 24px',
                      background: '#64748b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    ❌ Cancelar
                  </button>
                )}
              </div>
            </div>

            <div className="noticias-lista">
              <h3>📋 Notícias Cadastradas ({noticias.length})</h3>
              {noticias.length === 0 ? (
                <p className="empty-message">Nenhuma notícia cadastrada</p>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  {noticias.map(noticia => (
                    <div key={noticia.id} style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'start'
                    }}>
                      {noticia.urlImagem && (
                        <img 
                          src={noticia.urlImagem} 
                          alt={noticia.titulo}
                          style={{
                            width: '120px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      )}
                      <div style={{flex: 1}}>
                        <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px'}}>
                          <h4 style={{margin: 0}}>{noticia.titulo}</h4>
                          <span style={{
                            padding: '4px 12px',
                            background: '#e0e7ff',
                            color: '#4338ca',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {noticia.categoria}
                          </span>
                          <span style={{
                            padding: '4px 12px',
                            background: noticia.ativa ? '#d1fae5' : '#fee2e2',
                            color: noticia.ativa ? '#065f46' : '#991b1b',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {noticia.ativa ? '✅ Ativa' : '❌ Inativa'}
                          </span>
                        </div>
                        <p style={{color: '#64748b', margin: '8px 0', fontSize: '14px'}}>{noticia.resumo}</p>
                        <p style={{fontSize: '12px', color: '#94a3b8'}}>
                          📅 {new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                        <button 
                          onClick={() => editarNoticia(noticia)}
                          style={{
                            padding: '8px 16px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          onClick={() => toggleAtivaNoticia(noticia.id, noticia.ativa)}
                          style={{
                            padding: '8px 16px',
                            background: noticia.ativa ? '#f59e0b' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          {noticia.ativa ? '🚫 Desativar' : '✅ Ativar'}
                        </button>
                        <button 
                          onClick={() => deletarNoticia(noticia.id)}
                          style={{
                            padding: '8px 16px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
