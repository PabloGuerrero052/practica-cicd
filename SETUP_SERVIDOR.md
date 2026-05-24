# Montaje del servidor Ubuntu (self-hosted runner)

Todo el pipeline corre en tu VM Ubuntu. Sigue estos pasos **dentro de la VM**.

## 1. Prerrequisitos (instalar en la VM)

```bash
sudo apt update
sudo apt install -y git curl

# Node.js 20 (el pipeline usa npm)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Docker (si no estuviera ya)
sudo apt install -y docker.io
sudo systemctl enable --now docker

# Comprobar
node --version
npm --version
docker --version
docker run hello-world
```

## 2. Subir el proyecto a GitHub (desde Windows o desde la VM)

Crea el repo en github.com llamado `practica-cicd` (sin README).

```bash
git remote add origin https://github.com/GuerreroGutierrez/practica-cicd.git
git push -u origin main
```

## 3. Instalar el self-hosted runner en la VM

En GitHub: **repo → Settings → Actions → Runners → New self-hosted runner → Linux**.

GitHub te da los comandos exactos (con TU token). Son parecidos a:

```bash
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L https://github.com/actions/runner/releases/download/vX.X.X/actions-runner-linux-x64-X.X.X.tar.gz
tar xzf actions-runner-linux-x64.tar.gz

# Configurar (usa el token que te da GitHub)
./config.sh --url https://github.com/GuerreroGutierrez/practica-cicd --token TU_TOKEN

# Arrancar el runner
./run.sh
```

> Las labels por defecto del runner incluyen `self-hosted` y `linux`, que es lo que usa el workflow (`runs-on: [self-hosted, linux]`).

## 4. Verificar

- En GitHub → Settings → Actions → Runners debe aparecer tu runner en verde (Idle).
- Haz un push o lanza el workflow manualmente (Actions → Run workflow).
- Verás los jobs ejecutarse EN TU VM (el terminal de `./run.sh` muestra la actividad).

## 5. Comprobar el despliegue en la VM

Tras el job `deploy`, el contenedor queda corriendo:

```bash
docker ps
curl http://localhost:5000/
curl http://localhost:5000/salud
```

## Disparar el WEBHOOK (repository_dispatch)

Para demostrar el trigger webhook necesitas un token personal (Settings → Developer settings → Personal access tokens, con scope `repo`):

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer TU_PERSONAL_TOKEN" \
  https://api.github.com/repos/GuerreroGutierrez/practica-cicd/dispatches \
  -d '{"event_type":"deploy-webhook"}'
```

Esto lanza el pipeline igual que un webhook externo.
