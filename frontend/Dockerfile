# Usamos Node Alpine
FROM node:18-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiamos dependencias
COPY package*.json ./

# Instalamos
RUN npm install

# Copiamos el código fuente
COPY . .

# Exponemos el puerto de Vite (5173 por defecto)
EXPOSE 5173

# IMPORTANTE: --host permite ver la página desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]