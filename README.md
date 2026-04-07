# VakTions — Sistema de Gestão de Férias e Colaboradores

Vaktions é um sistema criado para facilitar o dia a dia do setor de Recursos Humanos.  
Nosso objetivo é tornar a **gestão de férias e colaboradores mais simples, organizada e profissional**, eliminando planilhas manuais, cálculos confusos e processos repetitivos.

O sistema foi pensado para empresas que desejam uma solução prática e moderna para acompanhar:

- Solicitações de férias  
- Controle de saldo de dias  
- Cadastro de colaboradores  
- Datas de admissão e regras de férias  
- Aprovação e histórico de férias  

Novas features já estão planejadas para as próximas versões.

---

## ✨ Principais Funcionalidades

- Cadastro de funcionários (Users)  
- Cálculo automático de dias de férias disponíveis  
- Cadastro e aprovação de solicitações de férias  
- Relacionamento entre empresas, colaboradores e períodos de férias  
- API REST para integração com frontend e sistemas externos  

### Funcionalidades já disponíveis no sistema

- Login com autenticação JWT
- Controle de acesso por perfil (`admin` e `user`)
- Solicitação de férias pelo colaborador
- Aprovação/rejeição de solicitações por administradores
- Visualização de histórico de solicitações
- Gestão de usuários (cadastro, edição e exclusão)
- Interface com tema claro/escuro e feedback por modais/notificações

---

## 🏗 Tecnologias Utilizadas

### Backend
- Node.js  
- TypeScript  
- Express  
- Sequelize ORM  
- PostgreSQL  
- Docker + Docker Compose  

### Frontend
- React  
- Vite  
- TypeScript  
- Material UI  

---

## 🧱 Arquitetura

### Backend

Organizado por camadas para separar responsabilidades:

- `routes/`: definição de endpoints e aplicação de middlewares
- `controllers/`: entrada e saída HTTP
- `services/`: regras de negócio
- `schemas/`: validação de payload com Zod
- `middlewares/`: autenticação/autorização e validação
- `models/`: entidades Sequelize
- `database/`: conexão e migrations

### Frontend

Estrutura orientada a domínio de interface:

- `pages/`: telas principais
- `components/`: componentes reutilizáveis
- `services/`: consumo da API
- `context/`: estado global (tema/notificações)
- `hooks/`: hooks customizados
- `types/`: contratos TypeScript

---

## 📁 Estrutura do Projeto

```text
backend/
	src/
		controllers/
		services/
		models/
		routes/
		middlewares/
		schemas/
		database/
			connection.ts
			migrations/
		utils/
		server.ts

frontend/
	src/
		pages/
		components/
		services/
		context/
		hooks/
		types/
```


---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

```env
PORT=3001

DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=vaktions_dev
JWT_SECRET=defina-um-segredo-forte
JWT_EXPIRES_IN=86400
```


> 💡 Durante o desenvolvimento com Docker, o `DB_HOST` deve ser **db**, que é o nome do serviço no docker-compose.

---

## 🐳 Rodando com Docker

### 1. Subir backend + banco de dados

```bash
cd backend
docker compose up -d
```

Isso irá:

- subir o Postgres
- construir e executar o backend em container
- expor a API em `http://localhost:3001`

### 2. Parar containers

```bash
docker compose down
```

### 3. Ver logs

```bash
docker compose logs -f backend
```

---

▶️ Rodando o Frontend

No diretório do frontend:

```bash
cd frontend
npm install
npm run dev
```


O frontend rodará em:

`http://localhost:5173`


(A porta pode variar dependendo do Vite.)

---

🧪 Scripts Disponíveis (Backend)

```bash
npm run dev        # Inicia o servidor em modo desenvolvimento
npm run build      # Compila TypeScript para a pasta dist
npm start          # Executa o servidor a partir da pasta dist
```

🧪 Scripts Disponíveis (Frontend)

```bash
npm run dev        # Inicia frontend em desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview local da build
npm run lint       # Lint do projeto
```

---

🧬 Migrations (Sequelize)

Criar migration:

```bash
npx sequelize-cli migration:generate --name nome-da-migration
```


Rodar migrations:

```bash
npx sequelize-cli db:migrate
```


Desfazer última migration:

```bash
npx sequelize-cli db:migrate:undo
```

---

## 📌 Regras de negócio de férias já implementadas

- Mínimo de 12 meses de trabalho para solicitar férias
- Mínimo de 5 dias por solicitação
- Máximo de 3 períodos por ciclo anual
- Máximo de 30 dias por ciclo
- Pelo menos um período de 14 dias ou mais
- Bloqueio de nova solicitação quando já existe solicitação pendente


🔮 Roadmap (Futuras Features)

### Melhorias técnicas planejadas

- Testes automatizados (backend e frontend)
- Pipeline CI (lint + build + testes)
- Melhoria da estratégia de autenticação/sessão
- Evolução de logs e observabilidade
- Documentação de API (OpenAPI/Swagger)

### Novas features planejadas

- Painel administrativo para empresas
- Regras avançadas de cálculo de férias
- Relatórios de RH (PDF, Excel)
- Controle de licenças e afastamentos
- Permissões avançadas por cargo
- Notificações por e-mail
- Dashboard com indicadores do time

---


🤝 Como Contribuir

Faça um fork

Crie uma branch:

```bash
git checkout -b feature/minha-feature
```


Faça commits objetivos

Abra um Pull Request

📄 Licença

Este projeto utiliza a licença MIT.

👨‍💻 Autor

Vaktions — Desenvolvido para tornar a gestão de pessoas mais prática, moderna e humanizada.


---

Se quiser:
- adicionar **badges** (Node, TS, Docker, React, Postgres)  
- adicionar **screenshots do sistema**  
- gerar uma **versão em inglês**  
- criar um **logo em SVG**  

é só pedir!