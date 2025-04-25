'use client'; // Needs state and event handlers

import React, { useState } from 'react';
// Removed CSS Module import: import styles from './IngredientForm.module.css';
import { Input } from "@/components/ui/input"; // Import Input
import { Button } from "@/components/ui/button"; // Import Button
import { Separator } from "@/components/ui/separator"; // Import Separator
// Consider Alert for better error display, but simple text for now
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus } from 'lucide-react'; // Import Plus icon

// Reason: Provides a form to add a new ingredient using shadcn/ui components.
// Handles input for ingredient name and quantity and passes data up.

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
      setError("Se requiere tanto el nombre como la cantidad."); // Translated error
      return;
    }
    setError(null);
    onIngredientAdded({ ingredientName: name, quantity });
    setName('');
    setQuantity('');
  };

  return (
    // Apply margin, padding, and use Separator
    <div className="mt-6 pt-4">
      <Separator className="mb-4" /> {/* Separator */}
      {/* Translated title */}
      <h4 className="text-md font-semibold mb-3">Añadir Nuevo Ingrediente</h4>
      {error && (
        // Simple error styling with Tailwind
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 p-2 rounded-md mb-3">
          {error} {/* Error message is already translated in handleAddClick */}
        </p>
        // Alternative using Alert:
        // <Alert variant="destructive" className="mb-3">
        //   <AlertDescription>{error}</AlertDescription>
        // </Alert>
      )}
      {/* Use flexbox and gap for input group */}
      <div className="flex gap-2 mb-2 items-center">
        <Input
          type="text"
          placeholder="Nombre del ingrediente" // Translated placeholder
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled}
          className="flex-grow" // Allow name input to grow
          aria-label="Nombre del ingrediente" // Translated aria-label
        />
        <Input
          type="text"
          placeholder="Cantidad" // Translated placeholder
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={disabled}
          className="w-32" // Fixed width for quantity
          aria-label="Cantidad" // Translated aria-label
        />
        {/* Added icon to Add button and translated */}
        <Button
          type="button"
          onClick={handleAddClick}
          disabled={disabled}
        // Use default button style, can adjust variant if needed
        >
          <Plus className="mr-2 h-4 w-4" /> Añadir
        </Button>
      </div>
    </div>
  );
};

export default IngredientForm;
