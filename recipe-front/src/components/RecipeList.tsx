import React from 'react';
import type { Recipe } from '../types';
import RecipeListItem from './RecipeListItem';
// Removed CSS Module import: import styles from './RecipeList.module.css';

// Reason: Displays a collection of recipes using the RecipeListItem component.
// Handles the iteration and presentation of the list using Tailwind for layout.

interface RecipeListProps {
  recipes: Recipe[];
  // Add the callback prop definition
  onFavoriteToggle?: (recipeId: number, newIsFavorite: boolean) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onFavoriteToggle }) => { // Destructure the prop
  if (!recipes || recipes.length === 0) {
    // Apply Tailwind classes for centering, color, and margin - Translated message
    return <p className="text-center text-muted-foreground mt-8">No se encontraron recetas.</p>;
  }

  return (
    // Apply Tailwind classes for max-width and centering. Padding might be handled by the page layout.
    <div className="max-w-3xl mx-auto">
      {/* Title is handled by the page */}
      {recipes.map((recipe) => (
        <RecipeListItem key={recipe.id} recipe={recipe} onFavoriteToggle={onFavoriteToggle} /> // Pass the prop down
      ))}
    </div>
  );
};

export default RecipeList;
