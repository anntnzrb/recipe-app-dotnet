import React from 'react';
import type { Ingredient } from '../types';
import IngredientItem from './IngredientItem';

interface IngredientListProps {
  ingredients: Ingredient[];
  onDeleteIngredient?: (ingredientId: number) => void;
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients, onDeleteIngredient }) => {

  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <>
      {ingredients.map((ingredient) => (
        <IngredientItem
          key={ingredient.id}
          ingredient={ingredient}
          onDelete={onDeleteIngredient}
        />
      ))}
    </>
  );
};

export default IngredientList;
