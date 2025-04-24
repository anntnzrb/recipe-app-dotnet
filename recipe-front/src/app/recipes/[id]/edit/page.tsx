import React from 'react';
import RecipeForm from '@/components/RecipeForm';
import { recipeService } from '@/services/recipeService';
import type { Recipe } from '@/types';
// import Link from 'next/link'; // For back button later

// Reason: Provides the page for editing an existing recipe.
// Fetches the recipe data and renders the RecipeForm in 'edit' mode.

interface EditRecipePageProps {
  params: Promise<{
    id: string; // URL parameters are always strings initially
  }>;
}

// This is a Server Component to fetch initial data
// Receive full props object to await params (Next.js 15+)
async function EditRecipePage(props: EditRecipePageProps) {
  const params = await props.params; // Await the params promise
  const id = parseInt(params.id, 10);
  let recipe: Recipe | null = null;
  let error: string | null = null;

  if (isNaN(id)) {
    error = "Invalid Recipe ID provided.";
  } else {
    try {
      recipe = await recipeService.getRecipeById(id);
    } catch (err) {
      console.error(`Failed to fetch recipe with ID ${id} for editing:`, err);
      if (err instanceof Error && err.message.includes('404')) {
        error = `Recipe with ID ${id} not found. Cannot edit.`;
      } else {
        error = err instanceof Error ? err.message : `An unknown error occurred while fetching recipe ${id} for editing.`;
      }
      recipe = null;
    }
  }

  return (
    <div>
      {/* Add a link back later */}
      {/* <Link href={`/recipes/${id}`}>Back to Recipe</Link> */}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {recipe ? (
        // Pass initial data and set edit mode
        <RecipeForm initialData={recipe} isEditMode={true} />
      ) : (
        !error && <p>Loading recipe data for editing...</p>
      )}
    </div>
  );
}

export default EditRecipePage;
