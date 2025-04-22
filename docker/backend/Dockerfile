# Usar una imagen base de .NET SDK para construir la aplicación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar el archivo del proyecto (.csproj) desde la raíz del contexto (C:\Users\Nil\Documents\asp-demo)
# a la raíz de /src en el contenedor
COPY *.csproj ./

# Si tienes un archivo de solución (.sln) en C:\Users\Nil\Documents\asp-demo, cópialo también:
# COPY *.sln ./

# Restaurar dependencias usando el archivo csproj en /src
RUN dotnet restore

# Copiar el resto del código fuente del proyecto desde la raíz del contexto
# Esto copia todo lo de C:\Users\Nil\Documents\asp-demo a /src en el contenedor
# Aunque copia la carpeta docker, para este Dockerfile simple lo aceptamos.
COPY . .

# Publicar la aplicación
# Ejecutamos dotnet publish desde /src (donde copiamos todo, incluyendo el csproj)
RUN dotnet publish -c Release -o out

# Usar una imagen base de .NET Runtime para ejecutar la aplicación final
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copiar los archivos publicados desde la etapa 'build'
# La salida publicada está en /src/out en la etapa build
COPY --from=build /src/out .

# Exponer el puerto en el que escucha la aplicación (ASP.NET Core por defecto escucha en el puerto 80 dentro del contenedor)
EXPOSE 80

# Comando para ejecutar la aplicación cuando el contenedor inicie
# VERIFICA que 'asp_demo.dll' sea el nombre EXACTO de tu archivo .dll principal
ENTRYPOINT ["dotnet", "asp-demo.dll"]
