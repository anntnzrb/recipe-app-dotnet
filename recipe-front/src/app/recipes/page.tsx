'use client'; // Convert to Client Component

import React, { useState, useEffect } from 'react';
import RecipeList from '@/components/RecipeList';
import { recipeService } from '@/services/recipeService';
import type { Recipe } from '@/types';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Input
import { PlusCircle, Search, Loader2 } from 'lucide-react'; // Import icons

// Reason: This page fetches and displays recipes, now with client-side search functionality.
function RecipesPage() {
  const [inputValue, setInputValue] = useState(''); // Raw input value from the text field
  const [searchTerm, setSearchTerm] = useState(''); // Debounced search term used for API calls
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true); // Indicate loading state
  const [error, setError] = useState<string | null>(null); // Store potential fetch errors

  // Debounce Effect: Update the `searchTerm` state only after the user stops typing.
  useEffect(() => {
    // Set a timer to update the searchTerm after 500ms
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500); // Debounce delay

    // Cleanup function: Clear the timer if the inputValue changes before the delay is over
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]); // This effect runs whenever the raw input value changes

  // Fetching Effect: Fetch recipes whenever the debounced `searchTerm` changes.
  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true); // Set loading true before fetching
      setError(null); // Clear previous errors
      try {
        // Call the service function with the debounced search term
        const fetchedRecipes = await recipeService.getAllRecipes(searchTerm);
        // Sort recipes: favorites first
        const sortedRecipes = fetchedRecipes.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
        setRecipes(sortedRecipes); // Update recipes state with sorted list
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setError("Ocurrió un error al cargar las recetas."); // Set error message
        setRecipes([]); // Clear recipes on error
      } finally {
        setLoading(false); // Set loading false after fetching attempt (success or failure)
      }
    }

    fetchRecipes(); // Execute the fetch function
  }, [searchTerm]); // This effect runs whenever the debounced search term changes

  // Reason: Handles the favorite toggle callback from RecipeListItem via RecipeList.
  // Updates the state reactively and re-sorts the list.
  const handleToggleFavorite = (recipeId: number, newIsFavorite: boolean) => {
    setRecipes(prevRecipes => {
      // Create a new array with the updated favorite status
      const updatedRecipes = prevRecipes.map(recipe =>
        recipe.id === recipeId ? { ...recipe, isFavorite: newIsFavorite } : recipe
      );
      // Sort the new array: favorites first
      const sortedRecipes = updatedRecipes.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
      return sortedRecipes; // Return the new, sorted array for the state update
    });
  };

  return (
    <div>
      {/* Header section with title and create button */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-2xl font-bold">🍲 Recetas</h1>
        <Button asChild>
          <Link href="/recipes/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Receta
          </Link>
        </Button>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative min-h-[40px]"> {/* Ensure minimum height */}
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar recetas por nombre..."
          className="pl-8 w-full" // Padding left for the icon
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update raw input value on change
        />
      </div>

      {/* Loading State Indicator */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Cargando recetas...</span>
        </div>
      )}

      {/* Error Display */}
      {!loading && error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 p-3 rounded-md mb-4">
          {error}
        </p>
      )}

      {/* Recipe List or Empty State */}
      {!loading && !error && (
        recipes.length > 0
          ? <RecipeList recipes={recipes} onFavoriteToggle={handleToggleFavorite} />
          : (
            <p className="text-center text-muted-foreground py-4">
              {searchTerm
                ? `No se encontraron recetas para "${searchTerm}".`
                : "No hay recetas disponibles."}
            </p>
          )
      )}
    </div>
  );
}

export default RecipesPage;
