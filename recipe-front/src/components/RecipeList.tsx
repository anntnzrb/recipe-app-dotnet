import React from 'react';
import type { Recipe } from '../types';
import RecipeListItem from './RecipeListItem';
import styles from './RecipeList.module.css'; // Import CSS Module

// Reason: Displays a collection of recipes using the RecipeListItem component.
// Handles the iteration and presentation of the list.

interface RecipeListProps {
  recipes: Recipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  if (!recipes || recipes.length === 0) {
    return <p className={styles.noRecipes}>No recipes found.</p>;
  }

  return (
    <div className={styles.listContainer}>
      {/* Title might be better placed on the page itself */}
      {/* <h2 className={styles.title}>Recipes</h2> */}
      {recipes.map((recipe) => (
        <RecipeListItem key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;
