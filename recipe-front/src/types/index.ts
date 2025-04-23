// Reason: Defines the core data structures for the frontend, mirroring the backend models.
// These types ensure consistency when fetching and manipulating recipe data.

export interface Ingredient {
  id: number;
  recipeId: number; // Foreign key back to the Recipe
  ingredientName: string; // Match backend model property name
  quantity: string; // Using string for flexibility (e.g., "1 cup", "2 tbsp", "pinch")
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: Ingredient[]; // Embed the list of ingredients
}
