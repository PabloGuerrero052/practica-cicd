# Práctica CI/CD — GitHub Actions
prueba cambio 2
**Alumno:** Pablo Guerrero Gutiérrez

App web en Node.js con un pipeline CI/CD que se ejecuta en un servidor Ubuntu propio (self-hosted runner): build, test, imagen Docker y despliegue automático.

## Pipeline

```
push → build → test → docker → deploy
```

- **Build:** instala dependencias y lint
- **Test:** 7 tests con jest
- **Docker:** construye la imagen
- **Deploy:** levanta el contenedor en el puerto 5000

Triggers: `push`, `cron` (diario), `manual` (con parámetros) y `webhook`.

## Probar en local

```bash
npm install
npm start      # http://localhost:5000
npm test
```
