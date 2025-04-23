#import "@preview/ilm:1.4.1": *

#set text(lang: "es")

#show: ilm.with(
  title: "Primer Avance - Reto de Desarrollo CITIKOLD",
  author: "Juan Antonio González",
  date: datetime(year: 2025, month: 04, day: 23)
)

= Introducción
Este documento constituye el primer informe de avance correspondiente al reto de desarrollo, elaborado en el segundo día de trabajo. El propósito de este informe es detallar la planificación inicial, la selección de tecnologías y las consideraciones preliminares del proyecto, reflejando el estado actual del proceso de familiarización y diseño.

= Desafío y Enfoque de Aprendizaje
Al recibir este reto, acepté el desafío de trabajar con tecnologías con las que no tenía experiencia previa alguna, particularmente el ecosistema *.NET* y *ASP.NET Core*. Si bien mi CV detalla experiencia con otras herramientas y tecnologías, específicamente *C\#* y el framework *ASP.NET* son nuevos para mí. Durante estos dos primeros días, he dedicado tiempo a revisar tutoriales, recursos y videos para familiarizarme con estas tecnologías

Soy consciente de las dificultades que implica aprender un lenguaje y un framework en un plazo corto. Por ello, considero prudente apoyarme en las herramientas de inteligencia artificial disponibles hoy en día. Estas herramientas actúan como un acelerador y potenciador, permitiéndome iterar rápidamente sobre conceptos y tecnologías con los que tengo escaso o nulo conocimiento previo. De esta manera, puedo acelerar la comprensión del ecosistema *.NET* y *ASP.NET Core*, además de recibir asistencia en el diseño y la generación de código.

= Tecnologías Seleccionadas
Siguiendo las preferencias indicadas en la propuesta del reto, las tecnologías seleccionadas para este proyecto son:

- *Backend:* *ASP.NET Core* 8 Web API (*C\#* 8.0.408 LTS)
- *Base de Datos:* *SQL Server* 2022
- *Frontend (Planificado):* Se contempla el uso de *Next.js* (v15.3.1 con *Deno* v2.2.11)
- *Despliegue:* *Docker*

= Planificación del Proyecto

== Alcance
Se ha optado por desarrollar un módulo de gestión de *Recetas de Cocina*. Esta elección busca un funcionamiento sencillo que permita concentrarse en el aprendizaje y la correcta aplicación de las tecnologías *.NET Core*, evitando la complejidad innecesaria al problema a resolver.

== Overview Arquitectura Backend
La arquitectura del backend sigue una estructura en capas:
- *Controladores:* Manejo de peticiones HTTP y orquestación de respuestas.
- *Servicios:* Contención de la lógica de negocio principal.
- *Capa de Datos:* Interacción con la base de datos mediante *Entity Framework Core*.
- *Modelos:* Definición de las entidades de datos (Receta, Ingrediente).

== Modelos de Datos Iniciales
Como parte del desarrollo inicial del backend, se han definido los modelos de datos principales utilizando *C\#*. A continuación se muestra el código para las entidades `Recipe` y `RecipeIngredient`:

#figure(
```cs
namespace RecipeBack.Models
{
    public class Recipe
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public List<RecipeIngredient>? Ingredients { get; set; } = [];
    }
}
```,
  caption: [Modelo de datos para la entidad Recipe]
)

#figure(
```cs
namespace RecipeBack.Models
{
    public class RecipeIngredient
    {
        public int Id { get; set; }
        public int RecipeId { get; set; }
        public string? IngredientName { get; set; }
        public string? Quantity { get; set; }
    }
}
```,
  caption: [Modelo de datos para la entidad RecipeIngredient]
)

#pagebreak()

== Planificación de Endpoints API
Se ha realizado una planificación inicial de los endpoints *RESTful* necesarios para la funcionalidad *CRUD* de las recetas y sus ingredientes asociados. Los endpoints planificados bajo la ruta base `/api/Recipes` son:

- `GET /`: Recupera una lista de todas las recetas.
- `GET /{id}`: Recupera una receta específica por su ID.
- `POST /`: Crea una nueva receta.
- `PUT /{id}`: Actualiza una receta existente.
- `DELETE /{id}`: Elimina una receta específica.
- `POST /{id}/ingredients`: Añade un nuevo ingrediente a una receta específica.
- `DELETE /{recipeId}/ingredients/{ingredientId}`: Elimina un ingrediente específico de una receta específica.

== Diagrama de Arquitectura

#figure(
  align(center, image("./assets/diagrams/diagram.PNG", width: 70%)),
  caption: [Diagrama inicial de la planificación de Endpoints API.]
)

= Próximos Pasos
Los siguientes pasos se centrarán en:
- Continuar la implementación de la lógica de negocio dentro de la capa de servicios.
- Iniciar la configuración básica del proyecto frontend (*Next.js* con *Deno*) para futuras integraciones.
- Desarrollar los endpoints planificados, comenzando por la creación y recuperación de recetas.
- Implementar *Docker* para facilitar el despliegue y la gestión del entorno de desarrollo.
