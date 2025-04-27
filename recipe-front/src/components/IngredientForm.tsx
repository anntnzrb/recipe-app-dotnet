'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from 'lucide-react';

interface IngredientFormProps {
  onIngredientAdded: (ingredientData: { ingredientName: string; quantity: string }) => void;
  disabled?: boolean;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ onIngredientAdded, disabled = false }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddClick = () => {
    if (!name.trim() || !quantity.trim()) {
      setError("Se requiere tanto el nombre como la cantidad.");
      return;
    }
    setError(null);
    onIngredientAdded({ ingredientName: name, quantity });
    setName('');
    setQuantity('');
  };

  return (
    <div className="mt-6 pt-4">
      <Separator className="mb-4" />
      <h4 className="text-md font-semibold mb-3">Añadir Nuevo Ingrediente</h4>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 p-2 rounded-md mb-3">
          {error}
        </p>
      )}
      <div className="flex gap-2 mb-2 items-center">
        <Input
          type="text"
          placeholder="Nombre del ingrediente"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled}
          className="flex-grow"
          aria-label="Nombre del ingrediente"
        />
        <Input
          type="text"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={disabled}
          className="w-32"
          aria-label="Cantidad"
        />
        <Button
          type="button"
          onClick={handleAddClick}
          disabled={disabled}
        >
          <Plus className="mr-2 h-4 w-4" /> Añadir
        </Button>
      </div>
    </div>
  );
};

export default IngredientForm;
