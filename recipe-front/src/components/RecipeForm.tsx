'use client'; // Mark as a Client Component

import React, { useState, useEffect } from 'react';
import type { Recipe, Ingredient } from '../types'; // Import Ingredient
import { useRouter } from 'next/navigation'; // Use App Router's navigation
import { recipeService } from '@/services/recipeService';
import IngredientList from './IngredientList'; // Import IngredientList
import IngredientForm from './IngredientForm'; // Import IngredientForm
import styles from './RecipeForm.module.css'; // Import CSS Module

// Reason: Provides a reusable form for creating and editing recipes, including ingredients.
// Handles user input, state management, and submission logic.

interface RecipeFormProps {
  initialData?: Recipe | null; // Optional initial data for editing
  isEditMode?: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ initialData = null, isEditMode = false }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]); // Add state for ingredients
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setIngredients(initialData.ingredients || []); // Initialize ingredients state
    } else {
      // Ensure ingredients are empty for create mode
      setIngredients([]);
    }
  }, [initialData, isEditMode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode && initialData) {
        // Update existing recipe - Note: API expects full Recipe object for PUT
        // We need to include the current state of ingredients.
        // Actual API calls for adding/deleting ingredients should happen separately
        // or the backend needs to handle diffing (which it doesn't based on PLANNING.md).
        // Update existing recipe - Backend expects full Recipe object including ingredients for PUT
        const updatedRecipeData: Recipe = {
          id: initialData.id, // Need ID for PUT
          name,
          description,
          // Prepare ingredients for backend: remove temporary negative IDs
          ingredients: ingredients.map(ing => ({
            ...ing,
            // Set ID to 0 for new ingredients (those with negative temp IDs)
            // Keep existing positive IDs
            id: ing.id > 0 ? ing.id : 0
          })),
        };
        // Using updateRecipe which expects the full Recipe object per service definition
        await recipeService.updateRecipe(initialData.id, updatedRecipeData);
        router.push(`/recipes/${initialData.id}`); // Redirect to detail page
      } else {
        // Create new recipe - API expects only name and description (ingredients added later)
        const newRecipeData = { name, description };
        const createdRecipe = await recipeService.createRecipe(newRecipeData);
        router.push(`/recipes/${createdRecipe.id}`); // Redirect to new recipe's detail page
      }
      // Optionally add router.refresh() if not using server actions later
      // TODO: Add actual API calls for adding/deleting ingredients here or manage state better
    } catch (err) {
      console.error("Failed to save recipe or manage ingredients:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setIsLoading(false);
    }
    // No need to set isLoading to false on success due to redirect
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>{isEditMode ? 'Edit Recipe' : 'Create New Recipe'}</h2>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.fieldGroup}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        // style removed
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isLoading}
        // style removed
        />
      </div>

      {/* --- Ingredient Management Section --- */}
      <div className={styles.ingredientsSection}>
        <h3>Ingredients</h3>
        <ul className={styles.ingredientItemList}> {/* Add UL wrapper */}
          {ingredients && ingredients.length > 0 ? (
            <IngredientList
              ingredients={ingredients}
              onDeleteIngredient={handleDeleteIngredient}
            />
          ) : (
            // Handle empty state directly
            <li className={styles.ingredientsNote}>No ingredients added yet.</li>
          )}
        </ul>
        {/* Only show Add Ingredient form if we have a recipe ID (i.e., in edit mode) */}
        {isEditMode && initialData && (
          <IngredientForm
            // recipeId no longer needed here
            onIngredientAdded={handleIngredientAdded} // Handler signature needs update
            disabled={isLoading} // Pass loading state down to disable form
          />
        )}
        {!isEditMode && (
          <p className={styles.ingredientsNote}><small>Save the recipe first to add ingredients.</small></p>
        )}
      </div>
      {/* --- End Ingredient Management --- */}

      <div className={styles.actions}>
        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? 'Saving...' : (isEditMode ? 'Update Recipe' : 'Create Recipe')}
        </button>
        <button type="button" onClick={() => router.back()} disabled={isLoading} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );

  // Handler for adding an ingredient (updates local state only)
  // Update signature to expect ingredientName
  function handleIngredientAdded(ingredientData: { ingredientName: string; quantity: string }) {
    // Create a new ingredient object (assign temporary ID for client-side key, backend will assign real ID)
    // Using a negative timestamp or similar for temporary unique key
    // Ensure recipeId is added to satisfy the Ingredient type
    const newIngredient: Ingredient = {
      id: -Date.now(), // Temporary negative ID for client-side key
      ingredientName: ingredientData.ingredientName, // Use ingredientName here
      quantity: ingredientData.quantity,
      recipeId: initialData?.id ?? 0, // Add recipeId, default to 0 if somehow missing (shouldn't happen in edit mode)
    };
    setIngredients(currentIngredients => [...currentIngredients, newIngredient]);
    setError(null); // Clear any previous errors
  }

  // Handler for deleting an ingredient (updates local state only)
  function handleDeleteIngredient(ingredientId: number) {
    setIngredients(currentIngredients => currentIngredients.filter(ing => ing.id !== ingredientId));
    setError(null); // Clear any previous errors
  }
};

export default RecipeForm;
