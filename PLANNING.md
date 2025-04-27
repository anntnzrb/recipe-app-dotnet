# Programming Challenge - Recipe Management Module

## Purpose
Develop a web application to manage kitchen recipes, demonstrating skills in backend development with ASP.NET Core 8 Web API, frontend with Next.js (using Node Runtime), SQL Server integration, and adherence to good development practices. Note: Project context is Spanish-speaking, so related topics might appear in Spanish

## Module Scope
Implement recipe management functionality:
- Recipes: Create, List, View Details (including ingredients), Edit, Delete.
- Ingredients per Recipe: Associate ingredients with quantities to a specific recipe, list/add/delete ingredients for a recipe.
- Search: Implement recipe search by name or description.
- Favorites: Allow marking recipes as favorites and optionally sorting by favorite status.

## Tech Stack
- Backend: ASP.NET Core 8 Web API (C# 8.0.408 LTS)
- Frontend: Next.js (v15.3.1, Node v20)
- Database: SQL Server 2022
- API Style: RESTful

## Architecture
3-tier architecture with clear separation between Frontend, Backend API, and Database:
1.  Frontend (Next.js): User interface consuming the API. Node.js, npm, or Bun will not be used.
2.  Backend (ASP.NET): Handles business logic and data access, exposing RESTful endpoints. Internally, it follows a layered structure to promote separation of concerns:
  *   Controllers (`Controllers/`): Receive incoming HTTP requests from the frontend, validate basic input, and orchestrate the response by calling the appropriate service methods. They act as the entry point to the API. Example: `RecipesController.cs`.
  *   Services (`Services/`): Contain the core business logic and coordinate data operations. They encapsulate the interactions with the data layer (DbContext) and are injected into the controllers. This layer ensures controllers remain thin and focused. Example: `RecipeService.cs` implementing `IRecipeService.cs`.
  *   Data Access (`Data/`): Manages the direct interaction with the database using Entity Framework Core. The `RecipeContext.cs` defines the DbContext, representing the database session and providing access to the data models (`Models/`).
  *   Models (`Models/`): Define the C# classes that represent the data structures stored in the database (e.g., `Recipe.cs`, `RecipeIngredient.cs`).
3.  Database (SQL Server): Persistent data storage.

## Deployment Strategy
The application is designed to be deployed using Docker. A `docker-compose.yml` file orchestrates the deployment, defining separate containers for the ASP.NET Core backend and the Next.js frontend. This ensures consistency across different environments and simplifies the deployment process.

## Backend

Communication between Frontend and Backend is done via the RESTful API exposed by the Controllers. Dependency Injection is used throughout the backend to manage dependencies between layers (e.g., injecting `IRecipeService` into `RecipesController`, and `RecipeContext` into `RecipeService`).

### API Endpoints

The backend exposes the following RESTful endpoints under the base path `/api/Recipes`:

*   `GET /`: Retrieves a list of all recipes, including their associated ingredients.
*   `GET /{id}`: Retrieves a specific recipe by its unique ID, including its ingredients.
*   `POST /`: Creates a new recipe. Requires recipe name and description in the request body.
*   `PUT /{id}`: Updates an existing recipe identified by its ID. Requires the complete updated recipe object in the request body.
*   `DELETE /{id}`: Deletes a specific recipe by its ID. This will also remove associated ingredients due to cascading delete configuration.
*   `POST /{id}/ingredients`: Adds a new ingredient to the recipe specified by `{id}`. Requires the ingredient details in the request body.
*   `DELETE /{recipeId}/ingredients/{ingredientId}`: Deletes a specific ingredient (`{ingredientId}`) from a specific recipe (`{recipeId}`).
*   `PATCH /{id}/favorite`: Toggles the favorite status of a specific recipe by its ID.

## Development Approach (Backend-First Workflow)
- Phase 1: Backend - Core Logic and API (In-Memory): Implement the core API endpoints (CRUD for recipes and ingredients) and logic using C# and ASP.NET Core API with in-memory data storage.
- Phase 2: Database Integration (SQL Server): Design and implement the SQL Server database schema using EF Core, migrating from in-memory storage.
- Phase 3: Frontend Development (Next.js) and Integration: Build the UI in Next.js, consuming the Backend API. Implement recipe listing, viewing, creation, editing, deletion, and ingredient management.
- Phase 4: Refinement and Final Preparation: Implement additional features like recipe search and favorites. Review code, improve best practices, finalize documentation (READMEs, DB Diagram), and prepare deliverables.
