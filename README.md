# 🌐 Telecom Multi-Tenant — White-Label Platform

Aplicação web React/Vite que serve **dois provedores de internet** (LeveTelecom e OPP Telecom) com a mesma base de código, alternando identidade visual via variáveis de ambiente no momento do build.

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    MESMA BASE DE CÓDIGO                  │
│                                                         │
│  .env.leve ──→ npm run build:leve ──→ Container :8080   │
│  .env.opp  ──→ npm run build:opp  ──→ Container :8081   │
│                                                         │
│  ┌────────────┐    ┌──────────┐    ┌──────────────────┐ │
│  │ TenantCtx  │───→│ CSS Vars │───→│ Toda a UI adapta │ │
│  └────────────┘    └──────────┘    └──────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

| Tenant | Paleta Base | Cor de Destaque | Porta |
|--------|-------------|-----------------|-------|
| **Leve Telecom** | Azul Profundo `#0B132B` | Ciano Neon `#00E5FF` | `8080` |
| **OPP Telecom** | Preto Sólido `#0A0A0A` | Laranja Fibra `#E8860C` | `8081` |

---

## ⚡ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar como Leve Telecom (padrão)
npm run dev
# ou explicitamente:
npm run dev:leve

# Rodar como OPP Telecom
npm run dev:opp
```

## 📦 Build de Produção

```bash
# Build Leve
npm run build:leve

# Build OPP
npm run build:opp
```

---

## 🐳 Deploy com Docker

### Build e start dos containers

```bash
docker compose up -d --build
```

Isso cria dois containers:
- `telecom-leve` → `http://localhost:8080`
- `telecom-opp` → `http://localhost:8081`

### Verificar status

```bash
docker compose ps
docker compose logs -f
```

### Rebuild após alterações

```bash
docker compose up -d --build
```

---

## 🚀 Deploy Automatizado na VM Linux (Turn-Key)

### ⚠️ REGRA DE OURO — LEIA ANTES DE EXECUTAR

> **O DNS dos domínios DEVE estar configurado ANTES de rodar o script.**
>
> Os domínios (`levetelecom.net` e `opptelecom.com.br`) precisam ter um
> registro DNS tipo **A** apontando para o **IP público da VM Linux**
> no painel do registrador (Registro.br, Hostinger, Cloudflare, etc.).
>
> Se o Certbot (etapa 6/6 do script) tentar gerar o certificado SSL e
> o domínio ainda não resolver para a máquina, ele **falhará por segurança**.
>
> **Tempo de propagação DNS**: pode levar de 5 minutos a 48 horas.
> Verifique com: `dig levetelecom.net +short`

### Executando o deploy

```bash
# 1. Copie todo o projeto para a VM
scp -r . usuario@IP_DA_VM:~/telecom

# 2. Conecte via SSH
ssh usuario@IP_DA_VM

# 3. Execute o script
cd ~/telecom
sudo bash deploy.sh
```

O script automatiza:
1. ✅ Atualização de pacotes do sistema
2. ✅ Instalação do Docker e Docker Compose
3. ✅ Instalação do Nginx e Certbot
4. ✅ Build e start dos containers React
5. ✅ Configuração do proxy reverso Nginx
6. ✅ Geração dos certificados SSL (Let's Encrypt)

### Resultado Final

```
  🌐 Leve Telecom:  https://levetelecom.net
  🌐 OPP Telecom:   https://opptelecom.com.br
```

---

## 📁 Estrutura do Projeto

```
├── .env.leve              # Variáveis de ambiente — Leve Telecom
├── .env.opp               # Variáveis de ambiente — OPP Telecom
├── Dockerfile             # Multi-stage build (Node → Nginx)
├── docker-compose.yml     # Orquestração dos 2 containers
├── nginx.conf             # Config Nginx (SPA routing + cache)
├── deploy.sh              # Script de deploy automatizado
├── src/
│   ├── config/
│   │   └── tenant.ts      # Módulo central de configuração
│   ├── contexts/
│   │   └── TenantContext.tsx  # React Context + CSS injection
│   ├── app/
│   │   ├── App.tsx         # Root component com TenantProvider
│   │   └── components/     # Componentes da aplicação
│   └── styles/
│       └── theme.css       # CSS custom properties (--brand-*)
└── ...
```

---

## 🎨 Como Adicionar um Novo Tenant

1. Crie um arquivo `.env.novotenant` na raiz (copie de `.env.leve`)
2. Preencha todas as variáveis `VITE_*` com os dados da nova marca
3. Adicione scripts no `package.json`:
   ```json
   "dev:novotenant": "vite --mode novotenant",
   "build:novotenant": "vite build --mode novotenant"
   ```
4. Adicione um novo serviço no `docker-compose.yml`
5. Atualize o `deploy.sh` com o novo domínio e certificado

---

## 📝 Licença

Projeto privado — Todos os direitos reservados.