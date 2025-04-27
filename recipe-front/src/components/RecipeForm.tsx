'use client'; // Mark as a Client Component

import React, { useState, useEffect } from 'react';
import type { Recipe, Ingredient } from '../types';
import { useRouter } from 'next/navigation';
import { recipeService } from '@/services/recipeService';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
// Removed CSS Module import: import styles from './RecipeForm.module.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// Consider Alert for better error display
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Save, X } from 'lucide-react'; // Import icons

// Reason: Provides a reusable form for creating/editing recipes using shadcn/ui.

interface RecipeFormProps {
  initialData?: Recipe | null;
  isEditMode?: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ initialData = null, isEditMode = false }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setIngredients(initialData.ingredients || []);
    } else {
      setIngredients([]);
    }
  }, [initialData, isEditMode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode && initialData) {
        const updatedRecipeData: Recipe = {
          id: initialData.id,
          name,
          description,
          isFavorite: initialData.isFavorite, // Added missing property
          ingredients: ingredients.map(ing => ({
            ...ing,
            id: ing.id > 0 ? ing.id : 0
          })),
        };
        await recipeService.updateRecipe(initialData.id, updatedRecipeData);
        router.push(`/recipes/${initialData.id}`);
      } else {
        const newRecipeData = { name, description };
        const createdRecipe = await recipeService.createRecipe(newRecipeData);
        // In create mode, ingredients are added after initial save.
        // Redirect to edit page to add ingredients? Or detail page? Let's go to detail for now.
        router.push(`/recipes/${createdRecipe.id}`);
      }
      // Consider router.refresh() if needed
    } catch (err) {
      console.error("Failed to save recipe:", err);
      // Translated error message
      setError(err instanceof Error ? `Error al guardar la receta: ${err.message}` : "Ocurrió un error desconocido al guardar la receta.");
      setIsLoading(false); // Keep form enabled on error
    }
  };

  // Handler for adding an ingredient (updates local state only)
  function handleIngredientAdded(ingredientData: { ingredientName: string; quantity: string }) {
    const newIngredient: Ingredient = {
      id: -Date.now(), // Temporary negative ID
      ingredientName: ingredientData.ingredientName,
      quantity: ingredientData.quantity,
      recipeId: initialData?.id ?? 0, // Should always have ID in edit mode
    };
    setIngredients(currentIngredients => [...currentIngredients, newIngredient]);
    setError(null);
  }

  // Handler for deleting an ingredient (updates local state only)
  function handleDeleteIngredient(ingredientId: number) {
    setIngredients(currentIngredients => currentIngredients.filter(ing => ing.id !== ingredientId));
    setError(null);
  }

  return (
    // Use Card for overall structure
    <Card className="max-w-2xl mx-auto my-4">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          {/* Added emoji to title and translated */}
          <CardTitle className="text-xl">
            📝 {isEditMode ? 'Editar Receta' : 'Nueva Receta'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 p-3 rounded-md">
              {error} {/* Error message is already translated in handleSubmit */}
            </p>
            // Alternative using Alert:
            // <Alert variant="destructive">
            //   <AlertTitle>Error</AlertTitle>
            //   <AlertDescription>{error}</AlertDescription>
            // </Alert>
          )}

          {/* Name Field - Translated */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Nombre de la receta" // Translated placeholder
            />
          </div>

          {/* Description Field - Translated */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Describe tu receta..." // Translated placeholder
              rows={4}
            />
          </div>

          <Separator />

          {/* --- Ingredient Management Section --- */}
          <div className="space-y-4">
            {/* Added emoji to ingredients title and translated */}
            <h3 className="text-lg font-semibold">🥕 Ingredientes</h3>
            {/* Ingredient List */}
            <ul className="space-y-2"> {/* Add UL wrapper with spacing */}
              {ingredients && ingredients.length > 0 ? (
                <IngredientList
                  ingredients={ingredients}
                  onDeleteIngredient={handleDeleteIngredient}
                />
              ) : (
                // Translated empty state message
                <li className="text-sm text-muted-foreground italic">Aún no se han añadido ingredientes.</li>
              )}
            </ul>

            {/* Ingredient Add Form (only in edit mode) */}
            {isEditMode && initialData ? (
              <IngredientForm
                onIngredientAdded={handleIngredientAdded}
                disabled={isLoading}
              />
            ) : !isEditMode ? (
              // Translated message for create mode
              <p className="text-sm text-muted-foreground italic"><small>Guarda la receta primero para poder añadir ingredientes.</small></p>
            ) : null}
          </div>
          {/* --- End Ingredient Management --- */}

        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {/* Added icon to Cancel button and translated */}
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          {/* Added icon to Save/Update button and translated */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando... {/* Translated */}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> {isEditMode ? 'Actualizar Receta' : 'Crear Receta'} {/* Translated */}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RecipeForm;
