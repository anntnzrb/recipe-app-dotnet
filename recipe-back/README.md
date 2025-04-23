# Backend de Recetas (recipe-back)

API Backend para la aplicación de Gestión de Recetas.

## Tecnologías Utilizadas

* ASP.NET Core 8 (usando .NET 8 SDK)
* SQL Server 2022 (vía Entity Framework Core)

## Prerrequisitos

* .NET 8 SDK instalado.
* SQL Server 2022 en ejecución y configurado para Autenticación de Windows (`Trusted_Connection=True`). Una base de datos llamada `RecipeDB` será creada/migrada automáticamente al iniciar.

## Ejecución

Desde el directorio `recipe-back`, ejecuta:

```bash
dotnet watch run
```

La API estará disponible en `http://localhost:5182`.
