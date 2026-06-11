#!/bin/bash
# ==============================================================================
# SCRIPT DE DEPLOY AUTOMATIZADO - LEVE TELECOM E OPP TELECOM
# Autor: Projeto LeveTelecom
# Este script instala Docker, Nginx, Certbot e sobe a arquitetura Multi-Tenant
# ==============================================================================

# Cores para o terminal ficar amigável
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}====================================================${NC}"
echo -e "${YELLOW}  Deploy Automatizado - Projeto Multi-Tenant Telecom ${NC}"
echo -e "${YELLOW}====================================================${NC}"
echo ""

# ── Validação: o script deve ser rodado como root ou com sudo ─
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}⚠️  Por favor, execute como root: sudo bash deploy.sh${NC}"
  exit 1
fi

# 1. Atualizar a máquina e instalar dependências básicas (Ubuntu/Debian)
echo -e "${GREEN}[1/6] Atualizando pacotes e instalando dependências...${NC}"
apt-get update -y
apt-get install -y curl apt-transport-https ca-certificates software-properties-common

# 2. Instalar Docker e Docker Compose (se não existirem)
echo -e "${GREEN}[2/6] Verificando Docker e Docker Compose...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}  → Docker não encontrado. Instalando...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $SUDO_USER 2>/dev/null || true
    rm -f get-docker.sh
    echo -e "${GREEN}  ✓ Docker instalado com sucesso${NC}"
else
    echo -e "${GREEN}  ✓ Docker já está instalado$(docker --version | grep -oP '\d+\.\d+\.\d+')${NC}"
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}  → Docker Compose não encontrado. Instalando...${NC}"
    apt-get install -y docker-compose-plugin
    echo -e "${GREEN}  ✓ Docker Compose instalado${NC}"
else
    echo -e "${GREEN}  ✓ Docker Compose já está instalado${NC}"
fi

# 3. Instalar Nginx e Certbot (para o Proxy Reverso e SSL)
echo -e "${GREEN}[3/6] Instalando Nginx e Certbot (Let's Encrypt)...${NC}"
apt-get install -y nginx certbot python3-certbot-nginx
systemctl enable nginx
systemctl start nginx
echo -e "${GREEN}  ✓ Nginx e Certbot prontos${NC}"

# 4. Subir os containers do React (Fase de Build)
echo -e "${GREEN}[4/6] Construindo e subindo as aplicações React (Docker)...${NC}"
cd "$(dirname "$0")"

# Tenta docker compose (v2) primeiro, senão docker-compose (v1)
if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi
echo -e "${GREEN}  ✓ Containers Leve (8080) e OPP (8081) estão rodando${NC}"

# 5. Configurar o Nginx (Criando os arquivos de Proxy Reverso automaticamente)
echo -e "${GREEN}[5/6] Configurando o Nginx para os domínios...${NC}"

# Removendo configuração padrão do Nginx que atrapalha
rm -f /etc/nginx/sites-enabled/default

# Escrevendo config da Leve Telecom
cat > /etc/nginx/sites-available/levetelecom.conf <<'EOF'
server {
    listen 80;
    server_name levetelecom.net www.levetelecom.net;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Escrevendo config da OPP Telecom
cat > /etc/nginx/sites-available/opptelecom.conf <<'EOF'
server {
    listen 80;
    server_name opptelecom.com.br www.opptelecom.com.br;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Ativando os sites
ln -sf /etc/nginx/sites-available/levetelecom.conf /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/opptelecom.conf /etc/nginx/sites-enabled/

# Testando e reiniciando Nginx
nginx -t
systemctl restart nginx
echo -e "${GREEN}  ✓ Nginx configurado para ambos os domínios${NC}"

# 6. Gerar os Certificados SSL (Cadeado Verde)
echo -e "${GREEN}[6/6] Gerando certificados SSL de segurança...${NC}"
echo -e "${YELLOW}  ⚠️  ATENÇÃO: O DNS já deve estar apontado para esta máquina!${NC}"
echo ""

certbot --nginx -d levetelecom.net -d www.levetelecom.net \
    --non-interactive --agree-tos -m admin@levetelecom.net --redirect \
    && echo -e "${GREEN}  ✓ SSL Leve Telecom OK${NC}" \
    || echo -e "${RED}  ✗ Falha SSL Leve - Verifique se o DNS está apontado${NC}"

certbot --nginx -d opptelecom.com.br -d www.opptelecom.com.br \
    --non-interactive --agree-tos -m admin@opptelecom.com.br --redirect \
    && echo -e "${GREEN}  ✓ SSL OPP Telecom OK${NC}" \
    || echo -e "${RED}  ✗ Falha SSL OPP - Verifique se o DNS está apontado${NC}"

# Configurar renovação automática
systemctl enable certbot.timer 2>/dev/null || true

echo ""
echo -e "${YELLOW}====================================================${NC}"
echo -e "${GREEN}✅ Deploy concluído com SUCESSO!${NC}"
echo -e "${YELLOW}====================================================${NC}"
echo ""
echo -e "  🌐 Leve Telecom:  ${GREEN}https://levetelecom.net${NC}"
echo -e "  🌐 OPP Telecom:   ${GREEN}https://opptelecom.com.br${NC}"
echo ""
echo -e "  📦 Containers:    ${GREEN}docker ps${NC}"
echo -e "  📋 Logs:          ${GREEN}docker compose logs -f${NC}"
echo -e "  🔄 Re-deploy:     ${GREEN}docker compose up -d --build${NC}"
echo ""
echo -e "${YELLOW}====================================================${NC}"
