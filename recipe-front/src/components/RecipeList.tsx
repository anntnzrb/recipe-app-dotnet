import React from 'react';
import type { Recipe } from '../types';
import RecipeListItem from './RecipeListItem';

interface RecipeListProps {
  recipes: Recipe[];
  onFavoriteToggle?: (recipeId: number, newIsFavorite: boolean) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onFavoriteToggle }) => {
  if (!recipes || recipes.length === 0) {
    return <p className="text-center text-muted-foreground mt-8">No se encontraron recetas.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {recipes.map((recipe) => (
        <RecipeListItem key={recipe.id} recipe={recipe} onFavoriteToggle={onFavoriteToggle} />
      ))}
    </div>
  );
};

export default RecipeList;
