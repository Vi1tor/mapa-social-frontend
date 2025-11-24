# 🚨 PROBLEMA: Frontend em Produção não Funciona

## ❌ Erro Atual:
O frontend no Vercel está tentando se conectar a `http://localhost:8080/api/v1`, que **não existe em produção**.

---

## ✅ SOLUÇÃO - Passo a Passo:

### 📋 Pré-requisitos:
1. **Backend precisa estar no Railway** (ou outro host)
2. **Frontend está no Vercel**

---

### 🔧 Opção 1: Apenas Configurar Vercel (Recomendado)

#### 1. Acesse o painel do Vercel:
   - https://vercel.com/dashboard
   - Selecione o projeto: `mapa-social-frontend`

#### 2. Configure a variável de ambiente:
   - Vá em **Settings** → **Environment Variables**
   - Adicione:
     - **Key:** `VITE_API_BASE`
     - **Value:** `https://SEU-BACKEND.railway.app/api/v1`
     - **Environment:** `Production`
   - Clique em **Save**

#### 3. Faça Redeploy:
   - Vá em **Deployments**
   - Clique nos **três pontos** da última build
   - Selecione **Redeploy**
   - Aguarde o deploy finalizar (~1-2 minutos)

#### 4. Teste:
   - Acesse: https://mapa-social-frontend.vercel.app

---

### 🔧 Opção 2: Deploy do Backend no Railway

Se você **ainda não tem o backend no Railway**, siga estes passos:

#### 1. Crie conta no Railway:
   - https://railway.app
   - Faça login com GitHub

#### 2. Crie novo projeto:
   - Clique em **New Project**
   - Selecione **Deploy from GitHub repo**
   - Escolha: `mapa-social-backend`

#### 3. Configure as variáveis de ambiente no Railway:
   ```env
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=(Railway fornece automaticamente)
   PORT=8080
   ```

#### 4. Aguarde o deploy (~3-5 minutos)

#### 5. Copie a URL do backend:
   - Ex: `https://mapa-social-backend-production.up.railway.app`

#### 6. Configure no Vercel (veja Opção 1 acima)

---

### 🔧 Opção 3: Rodar Backend Local Público (Temporário)

#### Use ngrok para tornar seu localhost público:

1. **Instale ngrok:**
   - https://ngrok.com/download
   - Ou via Chocolatey: `choco install ngrok`

2. **Inicie o backend local:**
   ```cmd
   cd c:\Users\Vitor\Desktop\mapa-social-backend-tmp
   java -jar target\demo-0.0.1-SNAPSHOT.jar
   ```

3. **Em outro terminal, inicie ngrok:**
   ```cmd
   ngrok http 8080
   ```

4. **Copie a URL fornecida:**
   - Ex: `https://abc123.ngrok.io`

5. **Configure no Vercel:**
   - `VITE_API_BASE=https://abc123.ngrok.io/api/v1`

6. **Redeploy no Vercel**

⚠️ **Atenção:** Esta solução é temporária! O ngrok expira quando você fecha o terminal.

---

## 📊 Verificação de CORS

Se mesmo após configurar você tiver erro de CORS, verifique o `WebConfig.java` no backend:

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOrigins(
            "http://localhost:5173",
            "https://mapa-social-frontend.vercel.app"  // ← Adicione esta linha
        )
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true);
}
```

---

## 🧪 Como Testar se Está Funcionando:

### 1. Teste o backend diretamente:
   - Abra: `https://seu-backend.railway.app/api/v1/servicos/mapa`
   - Deve retornar JSON com serviços

### 2. Teste o health check:
   - Abra: `https://seu-backend.railway.app/actuator/health`
   - Deve retornar: `{"status":"UP"}`

### 3. Verifique o console do navegador:
   - Abra: https://mapa-social-frontend.vercel.app
   - Pressione F12 → Console
   - Se aparecer erro de CORS ou 404, o backend não está configurado

---

## 📝 Checklist Final:

- [ ] Backend deployado no Railway (ou outro host)
- [ ] Variável `VITE_API_BASE` configurada no Vercel
- [ ] Frontend redeployado no Vercel
- [ ] CORS configurado no backend para aceitar a URL do Vercel
- [ ] Testado endpoint do backend diretamente
- [ ] Testado frontend no Vercel

---

## 🆘 Ainda com Problemas?

### Erro: "Failed to fetch"
- ✅ Verifique se o backend está online
- ✅ Teste a URL do backend diretamente no navegador

### Erro: "CORS policy"
- ✅ Adicione a URL do Vercel no `WebConfig.java`
- ✅ Faça commit e push
- ✅ Aguarde Railway fazer redeploy

### Página em branco
- ✅ Abra F12 → Console
- ✅ Veja o erro específico
- ✅ Verifique se `VITE_API_BASE` está definido

---

**Qual opção você quer seguir?**
- Opção 1: Já tenho backend no Railway, só preciso configurar
- Opção 2: Preciso fazer deploy do backend no Railway
- Opção 3: Quero testar rápido com ngrok
