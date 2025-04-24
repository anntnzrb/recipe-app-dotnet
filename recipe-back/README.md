# Backend de Recetas (recipe-back)

API Backend para la aplicación de Gestión de Recetas, construida con ASP.NET Core.

## Tecnologías Utilizadas

*   ASP.NET Core 8 (usando .NET 8 SDK)
*   Entity Framework Core 8
*   SQL Server 2022

## Ejecución

### Docker

Este backend está diseñado para ejecutarse junto con el frontend y la base de datos usando Docker Compose. Las instrucciones para ejecutar la aplicación completa se encuentran en el `README.md` principal del proyecto (en el directorio raíz).

Al ejecutar `docker-compose up` desde la raíz del proyecto, este servicio backend se iniciará automáticamente. Se conectará al servicio de base de datos (`db`) dentro de la red Docker usando la cadena de conexión proporcionada en `docker-compose.yml`. El frontend podrá acceder a esta API a través de la red Docker.
