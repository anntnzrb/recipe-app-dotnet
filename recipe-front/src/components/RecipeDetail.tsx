'use client'; // Need client component for state, effects, event handlers

import React, { useState, MouseEvent } from 'react'; // Added MouseEvent
import type { Recipe } from '../types';
import { useRouter } from 'next/navigation';
import { recipeService } from '@/services/recipeService';
import { useToast } from "@/hooks/use-toast"; // Import useToast
import Link from 'next/link';
import IngredientItem from './IngredientItem';
import { Button } from "@/components/ui/button"; // Import Button
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Removed CardDescription, CardFooter
import { Separator } from "@/components/ui/separator"; // Import Separator
// Consider Alert for better error display
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FilePenLine, Trash2 } from 'lucide-react'; // Import icons

// Reason: Displays the full details of a single recipe using shadcn/ui components.

interface RecipeDetailProps {
  recipe: Recipe;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(recipe?.isFavorite ?? false); // Local state for favorite status
  const { toast } = useToast(); // Hook for showing notifications

  // Handle case where recipe might not be loaded (though parent page should handle this)
  if (!recipe) {
    // Translated message
    return <p className="text-center text-muted-foreground mt-8">Los datos de la receta no están disponibles.</p>;
  }

  const handleDelete = async () => {
    // Basic confirmation - Translated
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la receta "${recipe.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    // TODO: Consider replacing window.confirm with shadcn/ui AlertDialog for better UX

    setIsDeleting(true);
    setError(null);

    try {
      await recipeService.deleteRecipe(recipe.id);
      router.push('/recipes');
      router.refresh();
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      // Translated error message
      const message = err instanceof Error ? `Error al eliminar la receta: ${err.message}` : "Error desconocido al eliminar la receta.";
      setError(message);
      setIsDeleting(false);
    }
  };

  // Reason: Handles the click on the favorite star, calls the API, updates local state, and shows feedback.
  const handleToggleFavorite = async (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault(); // Prevent any potential default behavior if wrapped differently later
    e.stopPropagation();

    if (!recipe) return; // Should not happen if recipe is loaded

    const newIsFavorite = !isFavorite; // Determine the new state first
    setIsFavorite(newIsFavorite); // Optimistically update the UI

    try {
      // Call the API to persist the change. We don't need the return value.
      await recipeService.toggleFavorite(recipe.id);

      // Show success toast based on the new state
      toast({
        title: "Success",
        description: `Recipe "${recipe.name}" ${newIsFavorite ? 'added to' : 'removed from'} favorites.`,
      });
      // Note: No need to call router.refresh() here as the state update handles the UI change.
    } catch (error) {
      console.error("Failed to toggle favorite status:", error);
      // Revert the optimistic update on error
      setIsFavorite(!newIsFavorite);
      toast({
        title: "Error",
        description: "Could not update favorite status. Please try again.",
        variant: "destructive",
      });
    }
  };


  return (
    // Use Card component as the main container
    <Card className="max-w-3xl mx-auto my-4">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          {/* Title and Favorite Star */}
          <div className="flex items-start gap-3"> {/* Container for title and star */}
            <CardTitle className="text-2xl font-bold">{recipe.name}</CardTitle>
            {/* Favorite Indicator */}
            <span
              onClick={handleToggleFavorite}
              className="cursor-pointer text-2xl pt-0.5 text-yellow-500 hover:text-yellow-400 transition-colors" // Adjusted styling
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              role="button"
            >
              {isFavorite ? '★' : '☆'}
            </span>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {/* Translated Edit button */}
            <Button asChild variant="outline" size="sm">
              <Link href={`/recipes/${recipe.id}/edit`}>
                <FilePenLine className="mr-2 h-4 w-4" /> {/* Added Edit icon */}
                Editar
              </Link>
            </Button>
            {/* Translated Delete button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando... {/* Translated */}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" /> {/* Added Delete icon */}
                  Eliminar {/* Translated */}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Error Display */}
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 p-3 rounded-md mb-4">
            {error} {/* Error message is already translated in handleDelete */}
          </p>
          // Alternative using Alert:
          // <Alert variant="destructive" className="mb-4">
          //   <AlertTitle>Error</AlertTitle>
          //   <AlertDescription>{error}</AlertDescription>
          // </Alert>
        )}

        {/* Description */}
        <p className="text-muted-foreground mb-6">{recipe.description}</p>

        <Separator className="my-4" />

        {/* Ingredients Section - Translated */}
        <h3 className="text-lg font-semibold mb-3">Ingredientes</h3>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul className="space-y-2"> {/* Use space-y for spacing between items */}
            {recipe.ingredients.map((ingredient) => (
              // IngredientItem already handles its own styling (incl. <li>)
              <IngredientItem key={ingredient.id} ingredient={ingredient} />
            ))}
          </ul>
        ) : (
          // Translated empty state message
          <p className="text-sm text-muted-foreground italic">No hay ingredientes listados para esta receta.</p>
        )}
      </CardContent>
      {/* CardFooter could be used for additional info or actions if needed */}
      {/* <CardFooter>
        <p>Footer content</p>
      </CardFooter> */}
    </Card>
  );
};

export default RecipeDetail;
