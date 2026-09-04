FROM node:20-slim
WORKDIR /app
COPY backend/package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY backend/src ./src
COPY admin ../admin
EXPOSE 4100
CMD ["node", "src/index.js"]
