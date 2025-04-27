export interface Ingredient {
  id: number;
  recipeId: number;
  ingredientName: string;
  quantity: string;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  isFavorite: boolean;
  ingredients: Ingredient[];
}
