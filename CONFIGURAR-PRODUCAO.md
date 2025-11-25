# 🚀 Configuração Completa - Frontend & Backend em Produção

## 🌐 URLs dos Ambientes
- **Frontend Vercel**: https://mapa-social-frontend.vercel.app/
- **Backend Railway**: https://mapa-social-backend-production.up.railway.app
- **API Base**: https://mapa-social-backend-production.up.railway.app/api/v1

## ✅ Status Atual (25/11/2025)
- ✅ **Backend Railway**: Funcionando (testado com /actuator/health)
- ✅ **API Categorias**: Retornando dados corretamente
- ⚠️ **CORS**: Precisa configurar variável `FRONTEND_ORIGIN`
- ⚠️ **Frontend**: Precisa configurar variável `VITE_API_BASE`

---

# 🎯 PARTE 1 - Configurar Railway (Backend)

## Por que configurar?
O backend precisa **permitir requisições CORS** vindas do domínio Vercel. Sem isso, o navegador bloqueia as chamadas API com erro CORS.

## Passo a Passo

### 1️⃣ Acessar Railway Dashboard
- Vá para: https://railway.app/dashboard
- Clique no projeto: **mapa-social-backend-production**

### 2️⃣ Adicionar Variável de Ambiente
1. No menu lateral, clique em **Variables** (Variáveis de Ambiente)
2. Clique em **+ New Variable**
3. Preencha:
   - **Variable Name**: `FRONTEND_ORIGIN`
   - **Value**: `https://mapa-social-frontend.vercel.app`
4. Clique em **Add** (Adicionar)

### 3️⃣ Aguardar Redeploy
- O Railway fará **redeploy automático** (2-3 minutos)
- Aguarde até o status mudar para **Active** (verde)

### ✅ Verificar se funcionou
```bash
# No PowerShell, teste:
curl https://mapa-social-backend-production.up.railway.app/actuator/health
# Deve retornar: {"status":"UP"}
```

---

# 🎯 PARTE 2 - Configurar Vercel (Frontend)

## Por que configurar?
O frontend precisa saber a **URL do backend** para fazer requisições à API. Essa URL muda entre desenvolvimento (localhost) e produção (Railway).

## Passo a Passo

### 1️⃣ Acessar Vercel Dashboard
- Vá para: https://vercel.com/dashboard
- Clique no projeto: **mapa-social-frontend** (ou nome similar)

### 2️⃣ Adicionar Variável de Ambiente
1. Clique em **Settings** (Configurações)
2. No menu lateral, clique em **Environment Variables**
3. Clique em **Add New**
4. Preencha:
   - **Key**: `VITE_API_BASE`
   - **Value**: `https://mapa-social-backend-production.up.railway.app/api/v1`
   - **Environments**: Marque **✓ Production**, **✓ Preview**, **✓ Development**
5. Clique em **Save**

### 3️⃣ Fazer Redeploy
1. Vá para **Deployments** (no topo da página)
2. Encontre o **último deployment**
3. Clique nos **três pontos (...)** no canto direito
4. Clique em **Redeploy**
5. Aguarde 1-2 minutos até finalizar

### ✅ Verificar se funcionou
1. Acesse: https://mapa-social-frontend.vercel.app/
2. Abra o **Console do Navegador** (F12)
3. Digite: `console.log(import.meta.env.VITE_API_BASE)`
4. Deve mostrar: `https://mapa-social-backend-production.up.railway.app/api/v1`

---

# 🧪 Testar Funcionalidades

Após configurar Railway + Vercel, teste:

## 1. Página Inicial
- ✅ Abrir https://mapa-social-frontend.vercel.app/
- ✅ Serviços devem aparecer no mapa
- ✅ Categorias devem carregar no filtro

## 2. Cadastro de Usuário
- ✅ Ir em **Cadastro**
- ✅ Criar novo usuário
- ✅ Deve salvar e redirecionar para login

## 3. Login
- ✅ Fazer login com usuário criado
- ✅ Deve redirecionar para área logada

## 4. Sugestões
- ✅ Logado, ir em **Sugerir Serviço**
- ✅ Preencher formulário
- ✅ Enviar sugestão
- ✅ Verificar se aparece na lista de sugestões

## 5. Admin Dashboard
- ✅ Fazer login como admin:
  - Email: `superadmin@mapasocial.com`
  - Senha: `admin123`
- ✅ Dashboard deve carregar estatísticas
- ✅ Ver sugestões pendentes
- ✅ Gerenciar usuários
- ✅ Criar notícias

---

# 🔐 Credenciais de Teste

Use estas credenciais para testar o sistema:

| Email | Senha | Role | Função |
|-------|-------|------|--------|
| `superadmin@mapasocial.com` | `admin123` | SUPER_ADMIN 🔱 | Controle total |
| `maria@admin.com` | `admin123` | ADMIN 👑 | Gerenciar usuários |
| `joao@user.com` | `admin123` | USER 👤 | Usuário comum |
| `pedro@user.com` | `admin123` | USER 👤 | Usuário comum |

---

# ⚠️ Solução de Problemas

## Erro: "Failed to fetch" ou "Network Error"

### Causa Provável
Backend não está aceitando requisições do Vercel (erro CORS)

### Solução
1. Verifique se `FRONTEND_ORIGIN` foi configurada no Railway
2. Valor deve ser exatamente: `https://mapa-social-frontend.vercel.app` (sem barra no final)
3. Aguarde redeploy do Railway completar

### Como Testar
Abra o Console (F12) e procure por erros como:
```
Access to fetch at '...' from origin 'https://mapa-social-frontend.vercel.app' has been blocked by CORS policy
```

---

## Erro: "Cannot read properties of undefined"

### Causa Provável
`VITE_API_BASE` não foi configurada ou redeploy não foi feito

### Solução
1. Verifique se a variável existe no Vercel (Settings → Environment Variables)
2. Certifique-se de ter feito **Redeploy** após adicionar
3. **IMPORTANTE**: Variáveis do Vite são lidas no **build time**, não em runtime

### Como Testar
No console do navegador:
```javascript
console.log(import.meta.env.VITE_API_BASE);
// Deve mostrar a URL do Railway, não undefined
```

---

## Erro: "401 Unauthorized"

### Causa Provável
Token JWT expirado ou inválido

### Solução
1. Fazer **Logout**
2. Fazer **Login** novamente
3. Tokens JWT expiram após algumas horas

---

## Backend Railway retorna "Application failed to respond"

### Causa Provável
Backend crashou ou está reiniciando

### Solução
1. Acesse Railway Dashboard → Deployments → Ver logs
2. Procure por erros no log (linhas em vermelho)
3. Erros comuns:
   - Banco de dados não conectado
   - Variável de ambiente faltando
   - Erro de sintaxe no código

---

# 📊 Logs Úteis

## Ver Logs do Railway (Backend)
1. Railway Dashboard → Seu Projeto
2. Clique em **Deployments**
3. Clique no deployment ativo
4. Veja os logs em tempo real

## Ver Logs do Vercel (Frontend)
1. Vercel Dashboard → Seu Projeto
2. Clique em **Deployments**
3. Clique no deployment ativo
4. Clique em **View Function Logs** (se houver erros)

## Ver Logs no Navegador (Frontend)
1. Abra o site: https://mapa-social-frontend.vercel.app/
2. Pressione **F12** (DevTools)
3. Vá na aba **Console**
4. Vá na aba **Network** para ver requisições HTTP

---

# ✅ Checklist Final de Produção

Antes de considerar o deploy completo, verifique:

- [ ] ✅ Railway: Variável `FRONTEND_ORIGIN` configurada
- [ ] ✅ Railway: Status **Active** (verde)
- [ ] ✅ Railway: `/actuator/health` retorna 200 OK
- [ ] ✅ Vercel: Variável `VITE_API_BASE` configurada
- [ ] ✅ Vercel: Redeploy realizado após adicionar variável
- [ ] ✅ Vercel: Site acessível sem erro 500
- [ ] ✅ Console do navegador: Sem erros CORS
- [ ] ✅ Console do navegador: `VITE_API_BASE` definida corretamente
- [ ] ✅ Teste: Login funcionando
- [ ] ✅ Teste: Cadastro funcionando
- [ ] ✅ Teste: Serviços carregando no mapa
- [ ] ✅ Teste: Admin dashboard acessível
- [ ] ✅ Teste: Sugestões sendo enviadas e listadas

---

# 🎉 Deploy Completo!

Se todos os itens acima estão ✅, seu sistema está 100% funcional em produção!

**URLs Públicas:**
- 🌐 **Site**: https://mapa-social-frontend.vercel.app/
- 🔌 **API**: https://mapa-social-backend-production.up.railway.app/api/v1

**Data de Configuração**: 25 de Novembro de 2025  
**Última Verificação**: Backend e API testados com sucesso
