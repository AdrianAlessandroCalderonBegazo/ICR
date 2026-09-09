FROM node:20-slim
# El build context es la raíz del repo (ver docker-compose.yml): un solo
# proceso sirve el sitio (icr-frontend-design1/public) y el CMS (este
# backend + icr-cms-mvp/admin), así que la imagen reproduce la misma
# estructura de carpetas hermanas que el checkout local, para que las
# rutas relativas de src/index.js funcionen igual en los dos entornos.
WORKDIR /app/icr-cms-mvp/backend
COPY icr-cms-mvp/backend/package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY icr-cms-mvp/backend/src ./src
COPY icr-cms-mvp/admin /app/icr-cms-mvp/admin
COPY icr-frontend-design1/public /app/icr-frontend-design1/public
EXPOSE 4100
CMD ["node", "src/index.js"]
