import React from 'react';
import RecipeList from '@/components/RecipeList';
import { recipeService } from '@/services/recipeService';
import type { Recipe } from '@/types';
import Link from 'next/link';
// Removed CSS Module import: import styles from './page.module.css';
import { Button } from "@/components/ui/button"; // Import Button
// Consider Alert for error display
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlusCircle } from 'lucide-react'; // Import an icon for create button

// Reason: This page fetches and displays the list of all recipes using Tailwind and shadcn/ui.

// This is a Server Component
async function RecipesPage() {
  let recipes: Recipe[] = [];
  let error: string | null = null;

  try {
    recipes = await recipeService.getAllRecipes();
  } catch (err) {
    console.error("Failed to fetch recipes:", err);
    // Keep original error message for debugging, but provide a generic user message
    error = "Ocurrió un error al cargar las recetas."; // Translated generic error
    recipes = []; // Ensure recipes is an empty array on error
  }

  return (
    // Container padding/margin is handled by the RootLayout now
    <div>
      {/* Header section with title and create button */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        {/* Added emoji to title and translated */}
        <h1 className="text-2xl font-bold">🍲 Recetas</h1>
        {/* Use Button component styled as a Link */}
        <Button asChild>
          {/* Added icon to button and translated */}
          <Link href="/recipes/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Receta
          </Link>
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 p-3 rounded-md mb-4">
          {/* Translated error message */}
          {error}
        </p>
        // Alternative using Alert:
        // <Alert variant="destructive" className="mb-4">
        //   <AlertTitle>Error</AlertTitle>
        //   <AlertDescription>{error}</AlertDescription>
        // </Alert>
      )}

      {/* Recipe List Component (already migrated) */}
      <RecipeList recipes={recipes} />
    </div>
  );
}

export default RecipesPage;
