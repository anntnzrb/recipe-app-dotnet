'use client'; // Need client component for state, effects, event handlers

import React, { useState } from 'react';
import type { Recipe } from '../types';
import { useRouter } from 'next/navigation';
import { recipeService } from '@/services/recipeService';
// Removed CSS Module import: import styles from './RecipeDetail.module.css';
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

  return (
    // Use Card component as the main container
    <Card className="max-w-3xl mx-auto my-4">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          {/* Recipe Title */}
          <CardTitle className="text-2xl font-bold">{recipe.name}</CardTitle>
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
