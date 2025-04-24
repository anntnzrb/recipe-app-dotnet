# Recipe Demo Application

Este proyecto contiene una aplicación full-stack para gestionar recetas, compuesta por:

*   **Frontend:** Una aplicación Next.js (`recipe-front/`)
*   **Backend:** Una API ASP.NET Core (`recipe-back/`)

La aplicación está configurada para ejecutarse utilizando Docker y Docker Compose.

## Ejecución con Docker

1.  **Abre una terminal** en el directorio raíz de este proyecto (donde se encuentra el archivo `docker-compose.yml`).
2.  **Ejecuta el siguiente comando:**

    ```bash
    docker-compose up --build
    ```

    *   `docker-compose up`: Inicia todos los servicios definidos en `docker-compose.yml`.

3.  **Accede a la aplicación:** Una vez que el frontend indique que está listo (usualmente mostrando `✓ Ready`), abre tu navegador y ve a:
    `http://localhost:3000`

## Servicios y Puertos

*   **Frontend (`recipe-front`):** Accesible en `http://localhost:3000`
*   **Backend (`recipe-back`):** Accesible (para pruebas directas de API, si es necesario) en `http://localhost:5182`

## Desarrollo Local

También puedes ejecutar los servicios de frontend y backend localmente fuera de Docker. Consulta los archivos `README.md` dentro de las carpetas `recipe-front` y `recipe-back` para obtener instrucciones detalladas sobre la ejecución local independiente. Necesitarás tener Node.js, .NET SDK y una instancia de SQL Server configurada localmente.
