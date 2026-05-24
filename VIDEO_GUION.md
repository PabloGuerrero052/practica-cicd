# GUION DEFINITIVO — Vídeo Práctica CI/CD
**Pablo Guerrero Gutiérrez · GitHub Actions + Ubuntu Server**

Texto para leer en voz alta. `[ENSEÑA]` = qué pantalla pones. El resto lo lees tal cual.

Ten abiertas 3 ventanas: navegador (repo + Actions + app), terminal cmd Windows, terminal SSH a la VM.
- Repo: https://github.com/PabloGuerrero052/practica-cicd
- App: http://192.168.1.139:5000

---

## 1 · INTRO
`[ENSEÑA: tu cara o la página principal del repo en GitHub]`

> "Hola. Me llamo Pablo Guerrero y esta es mi práctica de Integración Continua y Despliegue Continuo, CI/CD. Como herramienta orquestadora he elegido GitHub Actions. Lo importante de mi práctica es que el pipeline no corre en la nube de GitHub, sino en mi propio Ubuntu Server, que he montado usando un self-hosted runner. En ese servidor se construye la aplicación, se pasan los tests, se crea una imagen Docker y se despliega de forma automática. Os lo voy a enseñar todo paso a paso."

---

## 2 · QUÉ ES CI/CD
`[ENSEÑA: el README del repo]`

> "Primero, qué es CI/CD. La idea es automatizar todo el camino que recorre el código hasta producción. Yo solo hago un push con mis cambios, y a partir de ahí mi Ubuntu Server se encarga de montar el proyecto, ejecutar las pruebas, empaquetarlo y desplegarlo, todo de forma automática. Y algo clave: si alguna prueba falla, el proceso se para y no se despliega nada roto. El flujo es este: push, build, test, Docker y deploy. Cada paso solo continúa si el anterior ha ido bien."

---

## 3 · CÓDIGO
`[ENSEÑA: carpeta src/ en GitHub, abre main.js]`

> "Esta es la aplicación. Está hecha en Node.js con Express. Tiene tres rutas: la raíz, que devuelve un saludo; la ruta salud, que devuelve un estado en JSON; y la ruta operación, que recibe dos números y devuelve su suma y multiplicación."

`[ENSEÑA: main.test.js]`

> "Aquí están los tests, hechos con jest. Son siete pruebas: comprueban las funciones de cálculo y también que las rutas HTTP responden correctamente."

`[ENSEÑA: package.json]`

> "En el package.json están los scripts: start para arrancar, test para los jest y lint para revisar el código."

`[ENSEÑA: Dockerfile]`

> "Y este Dockerfile empaqueta la aplicación en una imagen Docker basada en node 20."

---

## 4 · PIPELINE YAML
`[ENSEÑA: .github/workflows/ci-cd.yml, parte de arriba "on:"]`

> "Este es el corazón de la práctica: el pipeline, definido en este fichero YAML. Arriba están los disparadores, los triggers. Tengo cuatro: push, que se ejecuta cuando subo código; un cron, que se ejecuta solo cada día a las seis de la mañana; el manual, con parámetros; y un webhook para sistemas externos."

`[ENSEÑA: sección workflow_dispatch > inputs]`

> "Aquí están los parámetros personalizados del disparo manual: puedo elegir el entorno, si quiero ejecutar los tests, y la etiqueta de versión de la imagen."

`[ENSEÑA: baja a los jobs]`

> "Y abajo, los cuatro trabajos en orden: build, que instala dependencias y hace el lint; test, que corre los jest; docker, que construye la imagen y la guarda como artefacto; y deploy, que levanta el contenedor en el servidor. Cada uno depende del anterior con la instrucción needs, así que si build falla, no se ejecuta nada más."

---

## 5 · SERVIDOR / RUNNER
`[ENSEÑA: GitHub → Settings → Actions → Runners, el runner en verde]`

> "Aquí se ve mi runner, mi servidor, conectado y activo en verde. Está instalado como servicio, así que está siempre escuchando esperando trabajos."

`[ENSEÑA: terminal SSH conectado a la VM, ejecuta los comandos]`

> "Y este es mi Ubuntu Server por dentro. Voy a comprobar que el servicio del runner está activo, y que tiene Node y Docker instalados, que es lo que el pipeline necesita para trabajar."

```
systemctl status actions.runner.*
node --version
docker --version
```

---

## 6 · PUSH EN VIVO
`[ENSEÑA: editas un archivo y haces push, o lo editas en GitHub web y commit]`

> "Ahora lo lanzo en directo. Hago un pequeño cambio y lo subo con un push. Con esto, el pipeline debería arrancar solo, sin que yo haga nada más."

`[ENSEÑA: pestaña Actions, entra al run que acaba de arrancar]`

> "Y aquí está: el pipeline se ha disparado automáticamente. Si entro, veo los trabajos ejecutándose uno a uno. Primero build instala y revisa el código. Luego test ejecuta las siete pruebas. Después docker construye la imagen. Y por último deploy despliega el contenedor en mi servidor."

---

## 7 · TRIGGER MANUAL
`[ENSEÑA: Actions → el workflow → botón Run workflow]`

> "Además del push, puedo lanzarlo manualmente desde aquí, con el botón Run workflow. Y me deja elegir los parámetros que vimos antes: pongo entorno producción y versión manual-uno."

`[ENSEÑA: das a Run workflow y aparece el nuevo run]`

> "Le doy a ejecutar, y veis que arranca un nuevo run con esos parámetros."

---

## 8 · TRIGGER WEBHOOK
`[ENSEÑA: terminal cmd — ejecuta el curl con el token TAPADO o fuera de cámara]`

> "El tercer disparador es un webhook. Esto simula que otro sistema externo pide un despliegue. Lo lanzo con una petición a la API de GitHub desde la terminal."

Comando (cmd, token NO visible):
```
curl -X POST -H "Authorization: Bearer TU_TOKEN" -H "Accept: application/vnd.github+json" https://api.github.com/repos/PabloGuerrero052/practica-cicd/dispatches -d "{\"event_type\":\"deploy-webhook\"}"
```

`[ENSEÑA: pestaña Actions, el run con evento repository_dispatch]`

> "Y aquí se ve el nuevo run, esta vez con el evento repository_dispatch, que es el webhook. También ha arrancado el pipeline correctamente."

---

## 9 · CRON
`[ENSEÑA: el YAML, sección schedule]`

> "El cuarto disparador es el cron, que está aquí en el YAML. Programa el pipeline para que se ejecute solo todos los días a las seis de la mañana, sin que yo intervenga."

---

## 10 · DESPLIEGUE + EVIDENCIAS
`[ENSEÑA: navegador → http://192.168.1.139:5000/]`

> "Vamos a ver el resultado del despliegue. Esta es mi aplicación, funcionando y desplegada en mi Ubuntu Server. Voy a probar las tres rutas."

`[ENSEÑA: las 3 URLs una a una]`

> "La raíz devuelve el saludo. La ruta salud devuelve el estado ok. Y la ruta operación, con un siete y un tres, devuelve la suma diez y la multiplicación veintiuno."

`[ENSEÑA: terminal VM, ejecuta los comandos]`

> "En el servidor compruebo que el contenedor está corriendo de forma persistente, y miro sus logs."

```
docker ps
docker logs practica-cicd-app
```

`[ENSEÑA: Actions → un run → sección Artifacts abajo]`

> "Y por último, las evidencias. Cada ejecución genera tres artefactos descargables: el resultado de los tests, la imagen Docker empaquetada en un fichero tar, y la evidencia del despliegue."

`[ENSEÑA: descarga evidencia-despliegue y abre el .txt]`

> "Abro la evidencia del despliegue: aquí aparece la fecha, el contenedor en ejecución, las respuestas HTTP de la aplicación y los logs. Esto demuestra que el despliegue ha funcionado."

---

## 11 · CIERRE
`[ENSEÑA: el repo o la app]`

> "En resumen: he montado un pipeline de CI/CD completo con GitHub Actions, ejecutándose sobre mi propio Ubuntu Server. Tiene cuatro disparadores, pasa tests, genera un artefacto Docker, y despliega la aplicación automáticamente dejando evidencias. Y esto es todo. Muchas gracias."

---

## CHECKLIST PRE-GRABACIÓN
- [ ] Runner verde (Settings → Runners)
- [ ] App responde en navegador (http://192.168.1.139:5000)
- [ ] Comando webhook copiado (token NO visible en cámara)
- [ ] 3 ventanas abiertas

## NOTAS
- NO enseñes el token legible en la Escena 8.
- Revoca el token al acabar: github.com/settings/tokens → Delete.
