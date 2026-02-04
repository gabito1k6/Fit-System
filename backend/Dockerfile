# Usamos una versión ligera de Node (Alpine)
FROM node:18-alpine

# Creamos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto que usa Express (según tu server.js es el 3000)
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "server.js"]