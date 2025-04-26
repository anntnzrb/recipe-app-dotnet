import type { Recipe, Ingredient } from '../types';

// Reason: Centralizes API communication logic, making components cleaner
// and API interactions easier to manage and update. Uses native fetch.

// Determine the correct API base URL based on the environment (server-side vs client-side)
const getBaseUrl = (): string => {
  // Prioritize NEXT_PUBLIC_API_URL for local development, fallback to internal for Docker
  const clientOrLocalUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5182/api/Recipes';
  const serverUrl = process.env.INTERNAL_API_URL || clientOrLocalUrl; // Use client/local as fallback for server if internal not set

  const isServer = typeof window === 'undefined';

  // Optional: Add a console log for debugging which URL is being used
  // console.log(`[recipeService] Using API URL: ${isServer ? serverUrl : clientOrLocalUrl} (isServer: ${isServer})`);

  return isServer ? serverUrl : clientOrLocalUrl;
};


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
  async getAllRecipes(name?: string): Promise<Recipe[]> {
    const baseUrl = getBaseUrl();
    let url = baseUrl;
    if (name && name.trim() !== '') {
      url += `?name=${encodeURIComponent(name.trim())}`;
    }
    const response = await fetch(url, { cache: 'no-store' });
    return handleResponse<Recipe[]>(response);
  },

  async getRecipeById(id: number): Promise<Recipe> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/${id}`);
    return handleResponse<Recipe>(response);
  },

  // Note: Backend POST expects only name and description according to PLANNING.md
  async createRecipe(recipeData: Pick<Recipe, 'name' | 'description'>): Promise<Recipe> {
    const baseUrl = getBaseUrl();
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData),
    });
    return handleResponse<Recipe>(response);
  },

  // Note: Backend PUT expects the complete updated recipe object
  async updateRecipe(id: number, recipeData: Recipe): Promise<void> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData),
    });
    // PUT often returns 204 No Content or the updated object. Handle accordingly.
    await handleResponse<void>(response); // Assuming No Content or ignoring returned object
  },

  async deleteRecipe(id: number): Promise<void> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    // DELETE often returns 204 No Content
    await handleResponse<void>(response);
  },

  // Note: Backend POST expects ingredient details
  async addIngredient(recipeId: number, ingredientData: Omit<Ingredient, 'id' | 'recipeId'>): Promise<Ingredient> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/${recipeId}/ingredients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredientData),
    });
    return handleResponse<Ingredient>(response);
  },

  async deleteIngredient(recipeId: number, ingredientId: number): Promise<void> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/${recipeId}/ingredients/${ingredientId}`, {
      method: 'DELETE',
    });
    // DELETE often returns 204 No Content
    await handleResponse<void>(response);
  },
};
