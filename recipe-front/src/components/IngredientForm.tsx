'use client'; // Needs state and event handlers

import React, { useState } from 'react';
// No longer need the full Ingredient type here if just passing data up
// import type { Ingredient } from '../types';
import styles from './IngredientForm.module.css'; // Import CSS Module

// Reason: Provides a form to add a new ingredient to a recipe.
// Handles input for ingredient name and quantity and passes data up.

interface IngredientFormProps {
  // recipeId is no longer needed here if the parent handles the API call
  onIngredientAdded: (ingredientData: { ingredientName: string; quantity: string }) => void; // Use ingredientName
  disabled?: boolean; // Allow parent to disable the form (e.g., during main form submission)
}

const IngredientForm: React.FC<IngredientFormProps> = ({ onIngredientAdded, disabled = false }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  // isLoading is removed - managed by parent
  const [error, setError] = useState<string | null>(null);

  // Renamed from handleSubmit as it's no longer a form submission
  const handleAddClick = () => {
    // event.preventDefault(); // No longer needed
    if (!name.trim() || !quantity.trim()) {
      setError("Both name and quantity are required.");
      return;
    }
    setError(null); // Clear error if validation passes

    // Pass the raw data up to the parent component's handler using ingredientName
    onIngredientAdded({ ingredientName: name, quantity }); // Use ingredientName here

    // Clear the form fields after submission
    setName('');
    setQuantity('');
  };

  // Removed the <form> tag, using a div instead
  return (
    <div className={styles.form}> {/* Keep class for styling */}
      <h4 className={styles.title}>Add New Ingredient</h4>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Ingredient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled} // Use disabled prop from parent
          // removed required
          className={styles.nameInput}
        />
        <input
          type="text"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={disabled} // Use disabled prop from parent
          // removed required
          className={styles.quantityInput}
        />
        {/* Changed button type to "button" and added onClick */}
        <button
          type="button"
          onClick={handleAddClick}
          disabled={disabled}
          className={styles.addButton}
        >
          Add
        </button>
      </div>
    </div> // Closing the div that replaced the form
  );
};

export default IngredientForm;
