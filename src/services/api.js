// Centraliza configuração de API e exige definição explícita de VITE_API_BASE.
// Removido fallback implícito para evitar apontar para backend errado.
if (!import.meta.env?.VITE_API_BASE) {
  throw new Error('VITE_API_BASE não definido. Configure em Vercel ou .env.local para desenvolvimento.');
}
const RAW_BASE = import.meta.env.VITE_API_BASE;

// Normaliza removendo barra final
export const API_BASE = RAW_BASE.replace(/\/$/, '');

export async function getServicosMapa() {
  const url = `${API_BASE}/servicos/mapa`;
  const resp = await fetch(url, { credentials: 'include' });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Erro HTTP ${resp.status} ao buscar ${url} Corpo: ${text}`);
  }
  return resp.json();
}

// Wrapper genérico
export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const resp = await fetch(url, { credentials: 'include', ...options });
  if (!resp.ok) throw new Error(`Erro HTTP ${resp.status} em ${url}`);
  return resp.json();
}
