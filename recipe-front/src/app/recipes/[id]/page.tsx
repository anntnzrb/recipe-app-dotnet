import React from 'react';
import RecipeDetail from '@/components/RecipeDetail';
import { recipeService } from '@/services/recipeService';
import type { Recipe } from '@/types';
// import Link from 'next/link'; // For back button later

// Reason: This dynamic route page fetches and displays details for a specific recipe based on the ID in the URL.

interface RecipePageProps {
  params: Promise<{
    id: string; // URL parameters are always strings initially
  }>;
}

// This is a Server Component
// Receive full props object to await params (Next.js 15+)
async function RecipePage(props: RecipePageProps) {
  const params = await props.params; // Await the params promise
  const id = parseInt(params.id, 10); // Convert id from string to number
  let recipe: Recipe | null = null;
  let error: string | null = null;

  if (isNaN(id)) {
    error = "Invalid Recipe ID provided.";
  } else {
    try {
      recipe = await recipeService.getRecipeById(id);
    } catch (err) {
      console.error(`Failed to fetch recipe with ID ${id}:`, err);
      // Customize error message based on potential API responses if needed
      if (err instanceof Error && err.message.includes('404')) {
        error = `Recipe with ID ${id} not found.`;
      } else {
        error = err instanceof Error ? err.message : `An unknown error occurred while fetching recipe ${id}.`;
      }
      recipe = null; // Ensure recipe is null on error
    }
  }

  return (
    <div>
      {/* Add a link back to the recipes list later */}
      {/* <Link href="/recipes">Back to Recipes</Link> */}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {recipe ? (
        <RecipeDetail recipe={recipe} />
      ) : (
        !error && <p>Loading recipe details...</p> // Show loading or handle case where recipe is null without error
      )}
    </div>
  );
}

export default RecipePage;
