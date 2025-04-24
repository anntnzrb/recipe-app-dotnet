import React from 'react';
import type { Ingredient } from '../types';
import IngredientItem from './IngredientItem';

// Reason: Displays a list of ingredients for a recipe.
// Uses IngredientItem for rendering each ingredient.

interface IngredientListProps {
  ingredients: Ingredient[];
  onDeleteIngredient?: (ingredientId: number) => void; // Optional handler for deleting
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients, onDeleteIngredient }) => {
  // Parent component now handles the empty state.
  // if (!ingredients || ingredients.length === 0) {
  //   return <p className={styles.noIngredients}>No ingredients listed.</p>;
  // }

  // Return only the list items (or null/fragment if needed)
  // Return null if the list is empty, so the parent can easily check.
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  // The parent component will provide the <ul> wrapper
  return (
    <>
      {ingredients.map((ingredient) => (
        <IngredientItem
          key={ingredient.id}
          ingredient={ingredient}
          onDelete={onDeleteIngredient} // Pass down the delete handler
        />
      ))}
    </>
  );
};

export default IngredientList;
