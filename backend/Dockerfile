# Imagem base
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia apenas os arquivos de dependência primeiro (cache de build)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Variável de ambiente (ajusta se quiser)
ENV NODE_ENV=development

# Porta que o backend expõe (ajusta se a sua for outra)
EXPOSE 3001

# Comando padrão para rodar a aplicação
CMD ["npm", "run", "dev"]
