FROM node:20-slim
WORKDIR /app
COPY server/package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY server/index.js ./
COPY public ../public
EXPOSE 5173
CMD ["node", "index.js"]
