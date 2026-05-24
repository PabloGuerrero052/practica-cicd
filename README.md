# Práctica CI/CD — GitHub Actions
**Alumno:** Pablo Guerrero Gutiérrez

## Estructura del proyecto

```
practica-cicd/
├── src/
│   ├── main.js          # Aplicación Express (Node.js)
│   └── main.test.js     # Tests con jest + supertest
├── .github/
│   └── workflows/
│       └── ci-cd.yml    # Pipeline completo
├── Dockerfile
├── docker-compose.yml
├── eslint.config.js
└── package.json
```

## Arquitectura

Todo el pipeline se ejecuta en un **servidor Ubuntu** mediante un **self-hosted runner** de GitHub Actions. El servidor hace build, test, construye la imagen Docker y despliega el contenedor de forma persistente. Ver [SETUP_SERVIDOR.md](SETUP_SERVIDOR.md).

## Pipeline CI/CD

### Triggers (disparadores)
| Trigger | Cuándo se ejecuta |
|---------|-------------------|
| `push` | Al hacer push en rama main |
| `schedule` (cron) | Todos los días a las 06:00 UTC |
| `workflow_dispatch` | Ejecución manual con parámetros |
| `repository_dispatch` | Webhook externo |

### Parámetros personalizados (workflow_dispatch)
- **entorno**: staging / produccion
- **ejecutar_tests**: true / false
- **version_tag**: tag de la imagen Docker

### Jobs del pipeline (todos en el servidor Ubuntu)
1. **Build** → npm ci + lint (eslint)
2. **Test** → ejecuta jest con 7 tests (artefacto: resultado-tests)
3. **Docker** → construye imagen y la exporta como .tar (artefacto)
4. **Deploy** → arranca contenedor persistente en puerto 5000 + evidencia post-despliegue (artefacto)

## Ejecutar localmente

```bash
npm install
npm start
# En otro terminal:
npm test
npm run lint
```

## Docker

```bash
docker-compose up -d
curl http://localhost:5000/
curl http://localhost:5000/salud
```

## Despliegue
App desplegada en servidor Ubuntu (self-hosted runner) en el puerto 5000.
