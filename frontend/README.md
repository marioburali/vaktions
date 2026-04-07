# VaKtions Frontend

Aplicação React responsável pela interface web do VaKtions.

## O que já está implementado

- Login e controle de sessão
- Rotas privadas
- Home com navegação por perfil
- Minhas solicitações de férias (criar e excluir)
- Gestão de solicitações (aprovação/rejeição para admin)
- Gestão de usuários para admin
- Notificações, modais de confirmação e tratamento de erro
- Tema claro/escuro

## Stack

- React + TypeScript + Vite
- Material UI
- React Router

## Estrutura principal

```text
src/
  pages/
  components/
  services/
  context/
  hooks/
  types/
```

## Como executar

```bash
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Configuração de ambiente

Defina a URL da API:

```env
VITE_API_URL=http://localhost:3001
```

## Próximos incrementos planejados

- Melhorar fluxo de sessão expirada
- Ampliar tipagem forte nas chamadas de API
- Melhorar estados de loading e feedback por tela
- Adicionar testes de componentes e fluxos críticos
