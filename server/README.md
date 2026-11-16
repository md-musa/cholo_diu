# Docker setup

From the repository root, copy the server environment example and set the JWT secrets and token lifetimes:

```powershell
Copy-Item server\.env.example server\.env
```

Build and start the admin, server, and MongoDB:

```sh
docker compose up --build
```

The admin is available at `http://localhost:8080` and the API at `http://localhost:4000`. MongoDB data is stored in the `mongo_data` Docker volume and is not exposed as a host port.

Stop the containers from the repository root with `docker compose down`.
