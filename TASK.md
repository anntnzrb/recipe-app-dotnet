# TASK.md

## Current Tasks & Backlog

### Phase 1: Backend - Core Logic & API (In-Memory)
- [x] Define C# classes for models (Recipe, RecipeIngredient)
- [x] Implement endpoint: `GET /api/recipes` (List Recipes)
- [x] Implement endpoint: `GET /api/recipes/{id}` (View Recipe Details with Ingredients)
- [x] Implement endpoint: `POST /api/recipes` (Create Recipe)
- [x] Implement endpoint: `PUT /api/recipes/{id}` (Update Recipe)
- [x] Implement endpoint: `DELETE /api/recipes/{id}` (Delete Recipe)
- [x] Implement endpoint: `POST /api/recipes/{id}/ingredients` (Add Ingredient to Recipe)
- [x] Implement endpoint: `DELETE /api/recipes/{recipeId}/ingredients/{ingredientId}` (Delete Ingredient from Recipe)
- [x] Implement basic validations in the API
- [x] Implement basic error handling for the API (HTTP codes)

### Phase 2: Database Integration (SQL Server & EF Core)
- [x] Design SQL Server Database schema (Tables: Recipes, RecipeIngredients - simple)
- [x] Integrate ASP.NET Core with SQL Server using Entity Framework Core
- [x] Create Database Diagram (first draft)

### Phase 3: Frontend Development (Next.js) & Integration
- [x] Setup Next.js project. (Assuming initial setup was done)
- [x] Define TypeScript types (`Recipe`, `Ingredient`) in `types/index.ts`.
- [x] Implement `recipeService.ts` with API call functions (using native fetch).
- [x] Create basic `Layout` component (Navbar, Footer).
- [x] Implement `RecipeList` and `RecipeListItem` components.
- [x] Create `/recipes` page to display the list using `RecipeList`.
- [x] Implement `RecipeDetail` component (showing ingredients).
- [x] Create `/recipes/[id]` page using `RecipeDetail`.
- [x] Implement `RecipeForm` component (for create/edit).
- [x] Create `/recipes/new` page using `RecipeForm`.
- [x] Create `/recipes/[id]/edit` page using `RecipeForm`.
- [x] Implement `IngredientList`, `IngredientItem`, `IngredientForm` components.
- [x] Integrate ingredient management into `RecipeDetail` and `RecipeForm`. (Done in RecipeForm - UI added, API calls integrated & refactored)
- [x] Implement delete functionality (recipes and ingredients) in UI components. (Recipe delete added to Detail view, Ingredient delete added to Form)
- [x] Apply styling using chosen approach (CSS Modules recommended). (Basic styling applied to core components, layout, and navigation)

### Phase 4: Refinement & Final Preparation
- [x] Review Backend code (Best Practices, DI with EF Core, cleanup)
- [x] Finalize Database Diagram
- [x] (Backend) Implement recipe search by name or description
- [x] (Frontend) Implement recipe search by name or description
- [x] (Feature: Favorite) (Backend) Add `IsFavorite` boolean field to `Recipe` model (default false) and update DB schema via migration.
- [x] (Feature: Favorite) (Backend) Implement API endpoint (`PATCH /api/recipes/{id}/favorite`) to toggle favorite status.
- [x] (Feature: Favorite) (Backend) Ensure one existing recipe is marked as favorite (IsFavorite = true) for initial testing (e.g., via seeding or manual update).
- [x] (Feature: Favorite) (Frontend) Add favorite indicator (e.g., star icon) to recipe list items and recipe detail view.
- [x] (Feature: Favorite) (Frontend) Implement click handler on the indicator to call the backend toggle API.
- [x] (Feature: Favorite) (Frontend) Sort recipe list to show favorites first.
- [x] (Note) Ensure READMEs in Git explain how to configure and run (DB, Backend, Frontend)

## Milestones

- 1. Functional Backend API with in-memory data (End Phase 1)
- 2. Functional Backend API with SQL Server connection (End Phase 2).
- 3. Complete Web Application (Frontend + Backend + DB) with core functionality implemented (End Phase 3)
- 4. All deliverables ready and submitted (End Phase 4)
