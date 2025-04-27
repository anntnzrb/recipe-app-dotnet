import React from 'react';
import RecipeForm from '@/components/RecipeForm';
import { recipeService } from '@/services/recipeService';
import type { Recipe } from '@/types';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface EditRecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function EditRecipePage(props: EditRecipePageProps) {
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
      console.error(`Failed to fetch recipe with ID ${id} for editing:`, err);
      if (err instanceof Error && err.message.includes('404')) {
        error = `No se encontró la receta con ID ${id}. No se puede editar.`;
      } else {
        error = `Ocurrió un error desconocido al buscar la receta ${id} para editar.`;
      }
      recipe = null;
    }
  }

  return (
    <div>
      { }
      { }
      {!isNaN(id) && (
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href={`/recipes/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la Receta
          </Link>
        </Button>
      )}

      { }
      {error && (
        <p className="text-center text-destructive bg-destructive/10 border border-destructive/30 p-4 rounded-md my-4">
          Error: {error}
        </p>
      )}

      { }
      {recipe ? (
        <RecipeForm initialData={recipe} isEditMode={true} />
      ) : (
        !error && <p className="text-center text-muted-foreground mt-8">Cargando datos de la receta para editar...</p>
      )}
    </div>
  );
}

export default EditRecipePage;
