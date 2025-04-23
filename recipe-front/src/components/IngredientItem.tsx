import React from 'react';
import type { Ingredient } from '../types';
import styles from './IngredientItem.module.css'; // Import CSS Module

// Reason: Displays a single ingredient item, potentially with actions like delete.
// Encapsulates the presentation of one ingredient row.

interface IngredientItemProps {
  ingredient: Ingredient;
  onDelete?: (ingredientId: number) => void; // Optional delete handler
}

const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient, onDelete }) => {
  return (
    <li className={styles.item}>
      <span className={styles.text}>
        {/* Use ingredientName for display */}
        {ingredient.ingredientName}: {ingredient.quantity}
      </span>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(ingredient.id)}
          className={styles.deleteButton} // Apply class, remove inline style
          // Update aria-label as well
          aria-label={`Delete ingredient ${ingredient.ingredientName}`}
        >
          &times; {/* Simple delete symbol */}
        </button>
      )}
    </li>
  );
};

export default IngredientItem;
