# Frontend Variáveis de Ambiente (Vercel e Local)

## Obrigatória: `VITE_API_BASE`
A aplicação agora exige que `VITE_API_BASE` esteja definida em build. O fallback automático foi removido para evitar apontar para ambientes incorretos.

### Valor em Produção (Vercel)
```
https://mapa-social-backend-production.up.railway.app/api/v1
```

### Definir na Vercel
1. Project → Settings → Environment Variables
2. Add Variable:
   - Name: `VITE_API_BASE`
   - Value: `https://mapa-social-backend-production.up.railway.app/api/v1`
   - Environment: Production (e Preview se usar branches)
3. Redeploy.

### Local Development
Crie `.env.local` na raiz do frontend:
```
VITE_API_BASE=http://localhost:8080/api/v1
```
Inicie o backend localmente e rode `npm run dev`.

### Verificação
Abra DevTools Console:
```javascript
import.meta.env.VITE_API_BASE
```
Deve mostrar a URL definida. Se não, o build falhará ao inicializar código que exige a variável.

### Erros Comuns
- `Error: VITE_API_BASE não definido`: variável ausente ou não disponível em ambiente de build.
- CORS: garantir que backend aceita domínio Vercel (`*.vercel.app`). Já configurado globalmente.

### Próximos Passos (Opcional)
- Adicionar variável para toggles de feature (`VITE_FEATURE_X=true`).
- Criar script de verificação em CI que falha se `VITE_API_BASE` não estiver presente.
