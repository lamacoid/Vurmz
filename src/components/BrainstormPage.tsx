"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChefHat, Clock, Plus, Check, Wand2 } from "lucide-react";
import { generateDishSuggestions } from "@/app/actions/brainstorm";
import { createDish } from "@/app/actions/dishes";
import { clsx } from "clsx";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  emoji: string | null;
  inStock: boolean;
}

interface DishSuggestion {
  name: string;
  description: string;
  cuisine: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: number;
  matchedIngredients: string[];
  additionalIngredients: string[];
}

interface BrainstormPageProps {
  ingredientsByCategory: Record<string, Ingredient[]>;
}

const categoryOrder = ["Protein", "Vegetable", "Carbs", "Dairy", "Herbs", "Pantry"];

export function BrainstormPage({ ingredientsByCategory }: BrainstormPageProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [suggestions, setSuggestions] = useState<DishSuggestion[]>([]);
  const [isGenerating, startTransition] = useTransition();
  const [savedDishes, setSavedDishes] = useState<Set<string>>(new Set());

  const toggleIngredient = (ingredient: Ingredient) => {
    setSelectedIngredients((prev) => {
      const isSelected = prev.some((i) => i.id === ingredient.id);
      if (isSelected) {
        return prev.filter((i) => i.id !== ingredient.id);
      }
      return [...prev, ingredient];
    });
  };

  const handleGenerate = () => {
    if (selectedIngredients.length === 0) return;

    startTransition(async () => {
      const results = await generateDishSuggestions(selectedIngredients);
      setSuggestions(results);
    });
  };

  const handleSaveDish = async (suggestion: DishSuggestion) => {
    const ingredientIds = selectedIngredients
      .filter((i) => suggestion.matchedIngredients.includes(i.name))
      .map((i) => i.id);

    await createDish({
      name: suggestion.name,
      description: suggestion.description,
      cuisine: suggestion.cuisine,
      difficulty: suggestion.difficulty,
      prepTime: suggestion.prepTime,
      ingredientIds,
    });

    setSavedDishes((prev) => new Set([...prev, suggestion.name]));
  };

  const sortedCategories = Object.entries(ingredientsByCategory).sort(([a], [b]) => {
    return categoryOrder.indexOf(a) - categoryOrder.indexOf(b);
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="pt-28 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-warm-900 tracking-tight mb-4">
              What&apos;s cooking?
            </h1>
            <p className="text-lg text-warm-500 max-w-lg mx-auto">
              Select the ingredients you have, and we&apos;ll inspire your next meal
            </p>
          </motion.div>

          {/* Ingredient Selection */}
          <div className="space-y-8 mb-12">
            {sortedCategories.map(([category, ingredients], categoryIndex) => {
              const inStockIngredients = ingredients.filter((i) => i.inStock);
              if (inStockIngredients.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.08, duration: 0.5 }}
                >
                  <h3 className="category-label">{category}</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {inStockIngredients.map((ingredient, index) => {
                      const isSelected = selectedIngredients.some((i) => i.id === ingredient.id);
                      return (
                        <motion.button
                          key={ingredient.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: categoryIndex * 0.08 + index * 0.03 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleIngredient(ingredient)}
                          className={clsx(
                            "ingredient-pill",
                            isSelected ? "ingredient-pill-selected" : "ingredient-pill-unselected"
                          )}
                        >
                          {ingredient.emoji && (
                            <span className="mr-1.5">{ingredient.emoji}</span>
                          )}
                          {ingredient.name}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Count & Generate Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4 mb-16"
          >
            {selectedIngredients.length > 0 && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-warm-500 text-sm"
              >
                {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? "s" : ""} selected
              </motion.p>
            )}
            <button
              onClick={handleGenerate}
              disabled={selectedIngredients.length === 0 || isGenerating}
              className="fab"
            >
              <Wand2 className="w-5 h-5" />
              {isGenerating ? "Cooking up ideas..." : "Generate Recipes"}
            </button>
          </motion.div>

          {/* Suggestions */}
          <AnimatePresence mode="wait">
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-warm-800 text-center">
                  Recipe Ideas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {suggestions.map((suggestion, index) => {
                    const isSaved = savedDishes.has(suggestion.name);
                    return (
                      <motion.div
                        key={suggestion.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="dish-card flex flex-col"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-orange flex items-center justify-center shadow-glow-orange">
                              <ChefHat className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-warm-800 text-lg leading-tight">
                                {suggestion.name}
                              </h3>
                              <p className="text-sm text-warm-500">
                                {suggestion.cuisine}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-warm-600 mb-4 flex-grow leading-relaxed">
                          {suggestion.description}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm mb-4">
                          <span className={clsx(
                            "px-2.5 py-1 rounded-full text-xs font-medium",
                            {
                              "bg-accent-emerald/10 text-accent-emerald": suggestion.difficulty === "Easy",
                              "bg-accent-amber/10 text-accent-amber": suggestion.difficulty === "Medium",
                              "bg-accent-coral/10 text-accent-coral": suggestion.difficulty === "Hard",
                            }
                          )}>
                            {suggestion.difficulty}
                          </span>
                          <div className="flex items-center gap-1.5 text-warm-400">
                            <Clock className="w-4 h-4" />
                            <span>{suggestion.prepTime} min</span>
                          </div>
                        </div>

                        {/* Matched Ingredients */}
                        <div className="mb-4">
                          <p className="text-xs font-medium text-warm-400 uppercase tracking-wider mb-2">
                            Using
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {suggestion.matchedIngredients.map((ing) => (
                              <span
                                key={ing}
                                className="px-2.5 py-1 bg-accent-emerald/10 text-accent-emerald rounded-full text-xs font-medium"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Additional Ingredients */}
                        {suggestion.additionalIngredients.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-warm-400 uppercase tracking-wider mb-2">
                              You&apos;ll need
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {suggestion.additionalIngredients.map((ing) => (
                                <span
                                  key={ing}
                                  className="px-2.5 py-1 bg-accent-amber/10 text-accent-amber rounded-full text-xs font-medium"
                                >
                                  {ing}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Save Button */}
                        <button
                          onClick={() => handleSaveDish(suggestion)}
                          disabled={isSaved}
                          className={clsx(
                            "w-full py-3 px-4 rounded-xl font-medium text-sm",
                            "flex items-center justify-center gap-2",
                            "transition-all duration-200",
                            {
                              "bg-warm-100 text-warm-500 cursor-default": isSaved,
                              "bg-warm-800 text-white hover:bg-warm-900 active:scale-[0.98]": !isSaved,
                            }
                          )}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-4 h-4" />
                              Saved
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Save Recipe
                            </>
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {suggestions.length === 0 && selectedIngredients.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-12"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-orange opacity-20 rounded-full blur-xl animate-pulse-soft" />
                <div className="relative w-24 h-24 rounded-full bg-warm-100 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-warm-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-warm-700 mb-2">
                Pick your ingredients
              </h3>
              <p className="text-warm-500 max-w-sm mx-auto">
                Tap the ingredients above to select them, then hit generate to see what you can make.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
