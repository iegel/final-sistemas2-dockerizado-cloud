CRUD simple de personas (nombre, apellido, DNI). Frontend y backend corren dockerizados; la base de datos vive en MongoDB Atlas, en la nube.

## Stack

- **Frontend:** React + Vite, servido en producción por NGINX
- **Backend:** Node.js + Express
- **Base de datos:** MongoDB Atlas (En la nube, no corre en contenedor)
- **Comunicación:** NGINX actúa como reverse proxy, reenviando las peticiones `/api/*` del frontend al backend. El backend, a su vez, se conecta a Atlas por internet.

## Estructura del proyecto

```
final-sistemas2-dockerizado-cloud/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env            (no se sube a git, hay que crearlo — ver más abajo)
│   ├── server.js
│   ├── models/
│   │   └── person.js
│   └── routes/
│       └── personRoutes.js
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── nginx.conf
    └── src/
        └── App.jsx
```

## Paso 1: crear la base de datos en MongoDB Atlas


1. Entrar a [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) y creá una cuenta gratis.
2. Al crear el primer proyecto, te va a ofrecer armar un cluster. Elegir el plan **gratuito (M0 / Free)**
3. Elegir cualquier proveedor/región  y creá el cluster.
4. **Crear un usuario de base de datos:** en el menú izquierdo, `Database Access` → `Add New Database User`. Elegir un nombre de usuario y una contraseña (Se van a utilizar en el `.env`).
5. **Autorizar tu IP:** en el menú izquierdo, `Network Access` → `Add IP Address`. Para no tener que estar reconfigurando esto cada vez que tu IP cambie (por ejemplo al usar datos móviles o otra red), elegí **"Allow Access from Anywhere"** (`0.0.0.0/0`).
6. **Obtener la cadena de conexión:** en `Database` → `Clusters`, botón `Connect` en el cluster → `Drivers and Client Libraries` → elegís `Node.js`. Copiar la línea:
   ```
   mongodb+srv://TU_USUARIO:<db_password>@NOMBRE_CLUSTER.xxxxx.mongodb.net/
   ```
   Reemplazar `<db_password>` por la contraseña que se creo en el paso 4.

## Paso 2: configurar el `.env`

Crear el archivo `backend/.env` con este contenido:

```
MONGO_URI=mongodb+srv://TU_USUARIO:TU_CONTRASEÑA@NOMBRE_CLUSTER.xxxxx.mongodb.net/sistemas2
PORT=3001
```

Importante: agregar `/sistemas2` al final (antes de cualquier `?`), para que los datos se guarden en una base llamada `sistemas2` — si lo dejás vacío, Mongoose los guarda por defecto en una base genérica llamada `test`.

## Paso 3: levantarlo con Docker

Requisito: tener Docker Desktop instalado y corriendo, y acceso a internet (para llegar a Atlas).

```bash
docker compose up --build
```

Esto levanta 2 contenedores:

| Servicio | Puerto | Descripción |
|---|---|---|
| `backend` | 3001 | API REST en Express, conectada a MongoDB Atlas por internet |
| `frontend` | 80 | React compilado, servido por NGINX, con proxy interno hacia `backend` |

Una vez levantado, la app queda disponible en:

```
http://localhost
```

Para bajar todo:

```bash
docker compose down
```

## Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/persons` | Lista todas las personas |
| GET | `/api/persons/:id` | Obtiene una persona por ID |
| POST | `/api/persons` | Crea una persona |
| PUT | `/api/persons/:id` | Actualiza una persona |
| DELETE | `/api/persons/:id` | Elimina una persona |

Todos los campos (`nombre`, `apellido`, `dni`) son obligatorios; el backend valida con Mongoose y devuelve `400` con un mensaje de error si falta alguno.

## Exposición pública (ngrok)

```bash
ngrok http 80
```
