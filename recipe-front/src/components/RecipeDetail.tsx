'use client'; // Need client component for state, effects, event handlers

import React, { useState } from 'react'; // Import useState
import type { Recipe, Ingredient } from '../types';
import { useRouter } from 'next/navigation'; // For redirecting after delete
import { recipeService } from '@/services/recipeService'; // For API call
import styles from './RecipeDetail.module.css'; // Import CSS Module
import Link from 'next/link'; // For Edit button
import IngredientItem from './IngredientItem'; // Import IngredientItem

// Reason: Displays the full details of a single recipe, including ingredients, and allows deletion.
// Separates the presentation logic for a recipe's detailed view.

interface RecipeDetailProps {
  recipe: Recipe;
}

// No longer need the local IngredientDisplay component
// const IngredientDisplay: React.FC<{ ingredient: Ingredient }> = ({ ingredient }) => (
//   <li>
//     {ingredient.name}: {ingredient.quantity}
//   </li>
// );

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!recipe) {
    // This case might be handled better in the parent page component
    return <p>Recipe data is not available.</p>;
  }

  const handleDelete = async () => {
    // Confirmation dialog
    if (!window.confirm(`Are you sure you want to delete the recipe "${recipe.name}"? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await recipeService.deleteRecipe(recipe.id);
      // Redirect to the main recipes list after successful deletion
      router.push('/recipes');
      router.refresh(); // Refresh server-side props for the list page
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      setError(err instanceof Error ? `Error deleting recipe: ${err.message}` : "Unknown error deleting recipe.");
      setIsDeleting(false); // Only set back on error, otherwise redirect happens
    }
  };

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.header}>
        <h1 className={styles.title}>{recipe.name}</h1>
        <div className={styles.actions}>
          <Link href={`/recipes/${recipe.id}/edit`} className={styles.editButton}>Edit</Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={styles.deleteButton} // Apply class, remove inline style
          >
            {isDeleting ? 'Deleting...' : 'Delete Recipe'}
          </button>
        </div>
      </div>
      <p className={styles.description}>{recipe.description}</p>

      <h2 className={styles.ingredientsTitle}>Ingredients</h2>
      <ul className={styles.ingredientsList}>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          // Map directly to IngredientItem now, IngredientList component is no longer needed here
          recipe.ingredients.map((ingredient) => (
            <IngredientItem key={ingredient.id} ingredient={ingredient} />
          ))
        ) : (
          // Handle no ingredients case directly within the ul
          <li className={styles.noIngredients}>No ingredients listed for this recipe.</li>
        )}
      </ul>
      {/* Ingredient management could be added here later if needed on detail view */}
    </div>
  );
};

export default RecipeDetail;
