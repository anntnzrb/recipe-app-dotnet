import React from 'react';
import RecipeForm from '@/components/RecipeForm';
import { recipeService } from '@/services/recipeService';
import type { Recipe } from '@/types';
import Link from 'next/link'; // Import Link for back button
import { Button } from "@/components/ui/button"; // Import Button
// Consider Alert for error display
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft } from 'lucide-react'; // Icon for back button

// Reason: Provides the page for editing an existing recipe using the migrated RecipeForm.

interface EditRecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

// This is a Server Component to fetch initial data
async function EditRecipePage(props: EditRecipePageProps) {
  const params = await props.params;
  const id = parseInt(params.id, 10);
  let recipe: Recipe | null = null;
  let error: string | null = null;

  if (isNaN(id)) {
    error = "El ID de la receta proporcionado no es válido."; // Translated error
  } else {
    try {
      recipe = await recipeService.getRecipeById(id);
    } catch (err) {
      console.error(`Failed to fetch recipe with ID ${id} for editing:`, err);
      if (err instanceof Error && err.message.includes('404')) {
        error = `No se encontró la receta con ID ${id}. No se puede editar.`; // Translated error
      } else {
        // Keep original error message for debugging, provide generic user message
        error = `Ocurrió un error desconocido al buscar la receta ${id} para editar.`; // Translated error
      }
      recipe = null;
    }
  }

  return (
    // Container padding/margin is handled by RootLayout
    <div>
      {/* Back Button - Link back to the detail page - Translated */}
      {/* Only show back button if ID is valid */}
      {!isNaN(id) && (
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href={`/recipes/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la Receta
          </Link>
        </Button>
      )}

      {/* Error Display - Translated */}
      {error && (
        <p className="text-center text-destructive bg-destructive/10 border border-destructive/30 p-4 rounded-md my-4">
          Error: {error}
        </p>
        // Alternative using Alert:
        // <Alert variant="destructive" className="my-4">
        //   <AlertTitle>Error</AlertTitle>
        //   <AlertDescription>{error}</AlertDescription>
        // </Alert>
      )}

      {/* Recipe Form Component (already migrated) */}
      {recipe ? (
        <RecipeForm initialData={recipe} isEditMode={true} />
      ) : (
        // Translated loading message
        !error && <p className="text-center text-muted-foreground mt-8">Cargando datos de la receta para editar...</p>
      )}
    </div>
  );
}

export default EditRecipePage;
