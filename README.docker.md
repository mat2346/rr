# Entorno de Desarrollo (Docker) 🐳

¡Hola equipo! Para correr todo el sistema (Frontend, Backend BFF, Java y Blockchain) en tu computadora local **sin tener que instalar nada más que Docker**, sigue estas instrucciones:

## Requisitos previos
1. Tener [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose.
2. Tener clonado este repositorio.

## Iniciar el proyecto

1. Copia la plantilla de variables de entorno:
   ```bash
   cp .env.example .env
   ```
   (En Windows PowerShell: `copy .env.example .env`)
2. Abre tu terminal en esta carpeta raíz (donde está el archivo `docker-compose.yml`).
3. Ejecuta el siguiente comando:
   ```bash
   docker-compose up
   ```

*(Nota: La primera vez que lo corras tardará unos minutos mientras descarga las imágenes de Node y Java, e instala las dependencias de los proyectos).*

## Puertos y Servicios
Una vez que veas en la consola que los servidores han iniciado, tendrás acceso a:

* **Aplicación Angular (Frontend):** [http://localhost:4200](http://localhost:4200)
* **API Next.js (Backend BFF):** [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql)
* **API Java (Gestión):** [http://localhost:8080/graphiql](http://localhost:8080/graphiql)
* **API Blockchain (Polygon Amoy):** [http://localhost:3001/health](http://localhost:3001/health)

### Red interna de Docker
Los contenedores se comunican **por nombre de servicio**, no por `localhost`:
* El BFF (Next.js) habla con Java vía `http://springboot:8080/graphql` (variable `MS3_URL`).
* El BFF y Java hablan con la blockchain vía `http://ms-blockchain:3001` (variable `BLOCKCHAIN_URL`).

Por eso solo necesitas exponer (`ports:`) los puertos que abres desde el navegador; entre contenedores Docker resuelve los nombres automáticamente.

## Blockchain — Polygon Amoy (testnet)
El servicio `ms-blockchain` registra y verifica recetas médicas en la testnet pública de **Polygon Amoy** (chainId 80002). El contrato ya está desplegado (`block_movil/ms-blockchain/deployments/amoy.json`, address `0xBa43Cc53c22851505179e0163A24E77681374805`) y su ABI está commiteado, así que **no necesitas compilar ni desplegar nada** para arrancar.

* **Solo lectura (verificar recetas):** funciona de inmediato, sin configuración.
* **Escritura (registrar recetas):** requiere una `PRIVATE_KEY` en el `.env` de una wallet con MATIC de testnet. Si la dejas vacía, el servicio arranca igual pero los endpoints de escritura devolverán error (modo lectura). Consigue MATIC gratis en https://faucet.polygon.technology

## App móvil (Expo / React Native)
La app móvil (`block_movil/mobile-rn`) **NO corre dentro de Docker**: Expo necesita exponer el bundler Metro y un QR a tu teléfono físico, lo que requiere la IP LAN de tu PC. Se arranca aparte:

```bash
cd block_movil/mobile-rn
npm install
npm start
```

Antes, edita `block_movil/mobile-rn/app.json` → `expo.extra` y reemplaza `192.168.1.100` por la IP LAN real de tu PC (`ipconfig | findstr IPv4` en Windows):
* `graphqlUrl`  → `http://<IP_LAN>:3000/api/graphql`  (el BFF Next.js)
* `blockchainUrl` → `http://<IP_LAN>:3001`            (ms-blockchain)

> La **verificación on-chain** del móvil usa `amoyRpcUrl` (RPC público de Amoy) y funciona desde cualquier red con internet, sin depender de tu PC.

Si el teléfono no conecta, abre el firewall:
```powershell
New-NetFirewallRule -DisplayName "Clinica-Dev" -Direction Inbound -LocalPort 4200,8080,3001,3000 -Protocol TCP -Action Allow
```

## ¿Cómo programar? (Live Reloading)
Este entorno está configurado con **volúmenes de desarrollo**. Esto significa que puedes abrir tu editor de código (VSCode, IntelliJ, etc.), hacer cambios en cualquier archivo dentro de las carpetas `frontend/`, `backend/`, `springboot/` o `block_movil/ms-blockchain/`, y **los contenedores detectarán los cambios y se reiniciarán automáticamente**. ¡No necesitas apagar Docker para ver tus cambios!

## Apagar el sistema
Para apagar los servidores, simplemente presiona `Ctrl + C` en la terminal donde corre Docker, o si lo dejaste en segundo plano, ejecuta:
```bash
docker-compose down
```
