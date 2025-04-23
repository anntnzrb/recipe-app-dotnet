import React from 'react';
import RecipeList from '@/components/RecipeList'; // Using alias configured by default in create-next-app
import { recipeService } from '@/services/recipeService';
import type { Recipe } from '@/types';
import Link from 'next/link'; // Import Link
import styles from './page.module.css'; // Import CSS Module

// Reason: This page fetches and displays the list of all recipes.
// It acts as the main entry point for viewing recipes.

// This is a Server Component, so we can fetch data directly
async function RecipesPage() {
  let recipes: Recipe[] = [];
  let error: string | null = null;

  try {
    // Fetch recipes from the API service
    recipes = await recipeService.getAllRecipes();
  } catch (err) {
    console.error("Failed to fetch recipes:", err);
    error = err instanceof Error ? err.message : "An unknown error occurred while fetching recipes.";
    // Assign empty array in case of error to prevent RecipeList from breaking
    recipes = [];
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recipes</h1>
        <Link href="/recipes/new" className={styles.createLink}>
          Create New Recipe
        </Link>
      </div>
      {error && <p style={{ color: 'red' }}>Error loading recipes: {error}</p>} {/* Keep error display for now */}
      <RecipeList recipes={recipes} />
    </div>
  );
}

export default RecipesPage;
