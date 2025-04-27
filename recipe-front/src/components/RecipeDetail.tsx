'use client';

import React, { useState, MouseEvent } from 'react';
import type { Recipe } from '../types';
import { useRouter } from 'next/navigation';
import { recipeService } from '@/services/recipeService';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import IngredientItem from './IngredientItem';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, FilePenLine, Trash2 } from 'lucide-react';

interface RecipeDetailProps {
  recipe: Recipe;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(recipe?.isFavorite ?? false);
  const { toast } = useToast();

  if (!recipe) {
    return <p className="text-center text-muted-foreground mt-8">Los datos de la receta no están disponibles.</p>;
  }

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la receta "${recipe.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await recipeService.deleteRecipe(recipe.id);
      router.push('/recipes');
      router.refresh();
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      const message = err instanceof Error ? `Error al eliminar la receta: ${err.message}` : "Error desconocido al eliminar la receta.";
      setError(message);
      setIsDeleting(false);
    }
  };

  const handleToggleFavorite = async (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!recipe) return;

    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);

    try {
      await recipeService.toggleFavorite(recipe.id);

      toast({
        title: "Success",
        description: `Recipe "${recipe.name}" ${newIsFavorite ? 'added to' : 'removed from'} favorites.`,
      });
    } catch (error) {
      console.error("Failed to toggle favorite status:", error);
      setIsFavorite(!newIsFavorite);
      toast({
        title: "Error",
        description: "Could not update favorite status. Please try again.",
        variant: "destructive",
      });
    }
  };


  return (
    <Card className="max-w-3xl mx-auto my-4">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3">
            <CardTitle className="text-2xl font-bold">{recipe.name}</CardTitle>
            <span
              onClick={handleToggleFavorite}
              className="cursor-pointer text-2xl pt-0.5 text-yellow-500 hover:text-yellow-400 transition-colors"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              role="button"
            >
              {isFavorite ? '★' : '☆'}
            </span>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button asChild variant="outline" size="sm">
              <Link href={`/recipes/${recipe.id}/edit`}>
                <FilePenLine className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 p-3 rounded-md mb-4">
            {error}
          </p>
        )}

        <p className="text-muted-foreground mb-6">{recipe.description}</p>

        <Separator className="my-4" />

        <h3 className="text-lg font-semibold mb-3">Ingredientes</h3>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient) => (
              <IngredientItem key={ingredient.id} ingredient={ingredient} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">No hay ingredientes listados para esta receta.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeDetail;
