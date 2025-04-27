'use client';

import React, { useState, useEffect } from 'react';
import type { Recipe, Ingredient } from '../types';
import { useRouter } from 'next/navigation';
import { recipeService } from '@/services/recipeService';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, X } from 'lucide-react';

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
          isFavorite: initialData.isFavorite,
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
        router.push(`/recipes/${createdRecipe.id}`);
      }
    } catch (err) {
      console.error("Failed to save recipe:", err);
      setError(err instanceof Error ? `Error al guardar la receta: ${err.message}` : "Ocurrió un error desconocido al guardar la receta.");
      setIsLoading(false);
    }
  };

  function handleIngredientAdded(ingredientData: { ingredientName: string; quantity: string }) {
    const newIngredient: Ingredient = {
      id: -Date.now(),
      ingredientName: ingredientData.ingredientName,
      quantity: ingredientData.quantity,
      recipeId: initialData?.id ?? 0,
    };
    setIngredients(currentIngredients => [...currentIngredients, newIngredient]);
    setError(null);
  }

  function handleDeleteIngredient(ingredientId: number) {
    setIngredients(currentIngredients => currentIngredients.filter(ing => ing.id !== ingredientId));
    setError(null);
  }

  return (
    <Card className="max-w-2xl mx-auto my-4">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl">
            📝 {isEditMode ? 'Editar Receta' : 'Nueva Receta'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 p-3 rounded-md">
              {error}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Nombre de la receta"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Describe tu receta..."
              rows={4}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🥕 Ingredientes</h3>
            <ul className="space-y-2">
              {ingredients && ingredients.length > 0 ? (
                <IngredientList
                  ingredients={ingredients}
                  onDeleteIngredient={handleDeleteIngredient}
                />
              ) : (
                <li className="text-sm text-muted-foreground italic">Aún no se han añadido ingredientes.</li>
              )}
            </ul>

            {isEditMode && initialData ? (
              <IngredientForm
                onIngredientAdded={handleIngredientAdded}
                disabled={isLoading}
              />
            ) : !isEditMode ? (
              <p className="text-sm text-muted-foreground italic"><small>Guarda la receta primero para poder añadir ingredientes.</small></p>
            ) : null}
          </div>

        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> {isEditMode ? 'Actualizar Receta' : 'Crear Receta'}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RecipeForm;
