// Centraliza configuração de API para facilitar troca de ambiente
// Fallback: se VITE_API_BASE não estiver definido em build (Vercel), usa domínio de produção conhecido.

const RAW_BASE = (import.meta.env?.VITE_API_BASE || (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
  ? 'https://mapa-social-backend-production.up.railway.app/api/v1'
  : 'http://localhost:8080/api/v1'));

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
