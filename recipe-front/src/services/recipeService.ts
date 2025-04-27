import type { Recipe, Ingredient } from '../types';


const getBaseUrl = (): string => {
  const clientOrLocalUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5182/api/Recipes';
  const serverUrl = process.env.INTERNAL_API_URL || clientOrLocalUrl; // use client/local as fallback for server if internal not set

  const isServer = typeof window === 'undefined';

  return isServer ? serverUrl : clientOrLocalUrl;
};


async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error (${response.status}): ${errorText}`);
    throw new Error(`API request failed with status ${response.status}: ${errorText || response.statusText}`);
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json() as Promise<T>;
  } else {
    return null as T;
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

  async createRecipe(recipeData: Pick<Recipe, 'name' | 'description'>): Promise<Recipe> {
    const baseUrl = getBaseUrl();
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData),
    });
    return handleResponse<Recipe>(response);
  },

  async updateRecipe(id: number, recipeData: Recipe): Promise<void> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData),
    });
    await handleResponse<void>(response);
  },

  async deleteRecipe(id: number): Promise<void> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    await handleResponse<void>(response);
  },

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
    await handleResponse<void>(response);
  },
  async toggleFavorite(id: number): Promise<Recipe> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/${id}/favorite`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<Recipe>(response);
  },
};
