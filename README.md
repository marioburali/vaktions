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

---

## 📁 Estrutura do Projeto (Backend)

/src
├── controllers/ # Controllers da API
├── services/ # Regras de negócio
├── models/ # Models Sequelize
├── database/
│ ├── connection.ts # Conexão com Postgres
│ ├── migrations/ # Migrations do banco
├── middlewares/
├── utils/
├── server.ts # Ponto de entrada do servidor


---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

PORT=3001

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=vaktions_dev


> 💡 Durante o desenvolvimento com Docker, o `DB_HOST` deve ser **db**, que é o nome do serviço no docker-compose.

---

## 🐳 Rodando com Docker

### 1. Subir backend + banco de dados

```bash
docker compose up -d

Isso irá:

subir o Postgres

construir e executar o backend em container

expor a API em http://localhost:3001

2. Parar containers
docker compose down

3. Ver logs
docker compose logs -f backend

▶️ Rodando o Frontend

No diretório do frontend:

npm install
npm run dev


O frontend rodará em:

http://localhost:5173


(A porta pode variar dependendo do Vite.)

🧪 Scripts Disponíveis (Backend)
npm run dev        # Inicia o servidor em modo desenvolvimento
npm run build      # Compila TypeScript para a pasta dist
npm start          # Executa o servidor a partir da pasta dist

🧬 Migrations (Sequelize)

Criar migration:

npx sequelize-cli migration:generate --name nome-da-migration


Rodar migrations:

npx sequelize-cli db:migrate


Desfazer última migration:

npx sequelize-cli db:migrate:undo


🔮 Roadmap (Futuras Features)

Painel administrativo para empresas

Regras avançadas de cálculo de férias

Relatórios de RH (PDF, Excel)

Controle de licenças e afastamentos

Permissões avançadas por cargo

Notificações por e-mail

Dashboard com indicadores do time


🤝 Como Contribuir

Faça um fork

Crie uma branch:

git checkout -b feature/minha-feature


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