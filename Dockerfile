FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install || true

COPY . .
RUN npm run build

ENV PORT=3000
EXPOSE 3000
CMD ["npm","start"]
