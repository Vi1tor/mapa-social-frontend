import React, { useState, useEffect } from 'react';
import { ServicoSocialCard } from '../components/Cards/ServicoSocialCard';
import './ServicosLista.css';

export function ServicosLista() {
  const [servicos, setServicos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicos();
    fetchCategorias();
  }, []);

  const fetchServicos = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/servicos/mapa');
      if (response.ok) {
        const data = await response.json();
        setServicos(data);
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://localhost:8080/categorias');
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const servicosFiltrados = servicos.filter(servico => {
    const matchCategoria = categoriaFiltro === 'todas' || servico.categoriaNome === categoriaFiltro;
    const matchBusca = servico.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       servico.enderecoResumo?.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  return (
    <div className="servicos-lista-page">
      <div className="servicos-lista-container">
        <div className="servicos-lista-header">
          <h1>🏢 Serviços Sociais Disponíveis</h1>
          <p>Encontre serviços sociais próximos a você e saiba como chegar</p>
        </div>

        <div className="servicos-filtros">
          <div className="filtro-busca">
            <span className="filtro-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nome ou endereço..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="filtro-input"
            />
          </div>

          <div className="filtro-categoria">
            <label>Categoria:</label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="filtro-select"
            >
              <option value="todas">📁 Todas as Categorias</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.nome}>{cat.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="servicos-loading">
            <p>Carregando serviços...</p>
          </div>
        ) : (
          <>
            <div className="servicos-count">
              {servicosFiltrados.length === 0 ? (
                <p>Nenhum serviço encontrado</p>
              ) : (
                <p>
                  <strong>{servicosFiltrados.length}</strong> {servicosFiltrados.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}
                </p>
              )}
            </div>

            <div className="servicos-grid">
              {servicosFiltrados.map(servico => (
                <ServicoSocialCard
                  key={servico.id}
                  servico={servico}
                  onNavigate={(s) => console.log('Navegando para:', s.nome)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
