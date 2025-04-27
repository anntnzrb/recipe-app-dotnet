import React from 'react';
import RecipeDetail from '@/components/RecipeDetail';
import { recipeService } from '@/services/recipeService';
import type { Recipe } from '@/types';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface RecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function RecipePage(props: RecipePageProps) {
  const params = await props.params;
  const id = parseInt(params.id, 10);
  let recipe: Recipe | null = null;
  let error: string | null = null;

  if (isNaN(id)) {
    error = "El ID de la receta proporcionado no es válido.";
  } else {
    try {
      recipe = await recipeService.getRecipeById(id);
    } catch (err) {
      console.error(`Failed to fetch recipe with ID ${id}:`, err);
      if (err instanceof Error && err.message.includes('404')) {
        error = `No se encontró la receta con ID ${id}.`;
      } else {
        error = `Ocurrió un error desconocido al buscar la receta ${id}.`;
      }
      recipe = null;
    }
  }

  return (
    <div>
      { }
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link href="/recipes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Recetas
        </Link>
      </Button>

      { }
      {error && (
        <p className="text-center text-destructive bg-destructive/10 border border-destructive/30 p-4 rounded-md my-4">
          Error: {error}
        </p>
      )}

      { }
      {recipe ? (
        <RecipeDetail recipe={recipe} />
      ) : (
        !error && <p className="text-center text-muted-foreground mt-8">Cargando detalles de la receta...</p>
      )}
    </div>
  );
}

export default RecipePage;
