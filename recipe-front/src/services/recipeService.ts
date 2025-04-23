import type { Recipe, Ingredient } from '../types';

// Reason: Centralizes API communication logic, making components cleaner
// and API interactions easier to manage and update. Uses native fetch.

// TODO: Replace with environment variable for flexibility - Done!
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5182/api/Recipes'; // Use env var, fallback to default

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error (${response.status}): ${errorText}`);
    throw new Error(`API request failed with status ${response.status}: ${errorText || response.statusText}`);
  }
  // Handle cases where the response might be empty (e.g., 204 No Content)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json() as Promise<T>;
  } else {
    // Return null or an appropriate value for non-JSON responses if needed
    // Or handle as text if that's expected for some endpoints
    return null as T; // Adjust as necessary based on API behavior
  }
}

export const recipeService = {
  async getAllRecipes(): Promise<Recipe[]> {
    const response = await fetch(API_BASE_URL);
    return handleResponse<Recipe[]>(response);
  },

  async getRecipeById(id: number): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse<Recipe>(response);
  },

  // Note: Backend POST expects only name and description according to PLANNING.md
  async createRecipe(recipeData: Pick<Recipe, 'name' | 'description'>): Promise<Recipe> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData),
    });
    return handleResponse<Recipe>(response);
  },

  // Note: Backend PUT expects the complete updated recipe object
  async updateRecipe(id: number, recipeData: Recipe): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData),
    });
    // PUT often returns 204 No Content or the updated object. Handle accordingly.
    await handleResponse<void>(response); // Assuming No Content or ignoring returned object
  },

  async deleteRecipe(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    // DELETE often returns 204 No Content
    await handleResponse<void>(response);
  },

  // Note: Backend POST expects ingredient details
  async addIngredient(recipeId: number, ingredientData: Omit<Ingredient, 'id' | 'recipeId'>): Promise<Ingredient> {
    const response = await fetch(`${API_BASE_URL}/${recipeId}/ingredients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredientData),
    });
    return handleResponse<Ingredient>(response);
  },

  async deleteIngredient(recipeId: number, ingredientId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${recipeId}/ingredients/${ingredientId}`, {
      method: 'DELETE',
    });
    // DELETE often returns 204 No Content
    await handleResponse<void>(response);
  },
};
