import React from 'react';
import type { Recipe } from '../types';
import Link from 'next/link'; // Import Link for navigation
import styles from './RecipeListItem.module.css'; // Import CSS Module

// Reason: Represents a single item in the recipe list.
// Encapsulates the display logic for one recipe summary.

interface RecipeListItemProps {
  recipe: Recipe;
}

const RecipeListItem: React.FC<RecipeListItemProps> = ({ recipe }) => {
  return (
    <div className={styles.item}>
      <Link href={`/recipes/${recipe.id}`} className={styles.link}>
        <h3 className={styles.title}>{recipe.name}</h3>
      </Link>
      <p className={styles.description}>{recipe.description}</p>
      {/* Add Edit/Delete buttons here if needed on the list view */}
    </div>
  );
};

export default RecipeListItem;
