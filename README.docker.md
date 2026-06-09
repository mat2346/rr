# Entorno de Desarrollo (Docker) 🐳

¡Hola equipo! Para correr todo el sistema (Frontend, Backend BFF y Java) en tu computadora local **sin tener que instalar nada más que Docker**, sigue estas instrucciones:

## Requisitos previos
1. Tener [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose.
2. Tener clonado este repositorio.

## Iniciar el proyecto

1. Abre tu terminal en esta carpeta raíz (donde está el archivo `docker-compose.yml`).
2. Ejecuta el siguiente comando:
   ```bash
   docker-compose up
   ```

*(Nota: La primera vez que lo corras tardará unos minutos mientras descarga las imágenes de Node y Java, e instala las dependencias de los proyectos).*

## Puertos y Servicios
Una vez que veas en la consola que los servidores han iniciado, tendrás acceso a:

* **Aplicación Angular (Frontend):** [http://localhost:4200](http://localhost:4200)
* **API Next.js (Backend BFF):** [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql)
* **API Java (Gestión):** [http://localhost:8080/graphiql](http://localhost:8080/graphiql)

## ¿Cómo programar? (Live Reloading)
Este entorno está configurado con **volúmenes de desarrollo**. Esto significa que puedes abrir tu editor de código (VSCode, IntelliJ, etc.), hacer cambios en cualquier archivo dentro de las carpetas `frontend/`, `backend/` o `springboot/`, y **los contenedores detectarán los cambios y se reiniciarán automáticamente**. ¡No necesitas apagar Docker para ver tus cambios!

## Apagar el sistema
Para apagar los servidores, simplemente presiona `Ctrl + C` en la terminal donde corre Docker, o si lo dejaste en segundo plano, ejecuta:
```bash
docker-compose down
```
