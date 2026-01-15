"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChefHat, Clock, ChevronRight, Plus, Check } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
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

export function BrainstormPage({ ingredientsByCategory }: BrainstormPageProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [suggestions, setSuggestions] = useState<DishSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useTransition();
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

    setIsGenerating(async () => {
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

  const difficultyColor = {
    Easy: "success",
    Medium: "warning",
    Hard: "info",
  } as const;

  return (
    <div>
      <PageHeader
        title="Brainstorm"
        subtitle="Select your ingredients and discover delicious dishes"
      />

      {/* Ingredient Selection */}
      <div className="space-y-6 mb-10">
        {Object.entries(ingredientsByCategory).map(([category, ingredients], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <h3 className="text-sm font-medium text-apple-gray-400 uppercase tracking-wider mb-3">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {ingredients
                .filter((i) => i.inStock)
                .map((ingredient) => {
                  const isSelected = selectedIngredients.some((i) => i.id === ingredient.id);
                  return (
                    <button
                      key={ingredient.id}
                      onClick={() => toggleIngredient(ingredient)}
                      className={clsx(
                        "px-4 py-2.5 rounded-full text-sm font-medium",
                        "transition-all duration-200 ease-out",
                        "border-2",
                        {
                          "bg-apple-blue text-white border-apple-blue scale-105": isSelected,
                          "bg-white text-apple-gray-600 border-apple-gray-200 hover:border-apple-gray-300 hover:shadow-sm":
                            !isSelected,
                        }
                      )}
                    >
                      {ingredient.emoji && (
                        <span className="mr-1.5">{ingredient.emoji}</span>
                      )}
                      {ingredient.name}
                    </button>
                  );
                })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Generate Button */}
      <div className="flex justify-center mb-12">
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={selectedIngredients.length === 0 || isGenerating}
          className="gap-2 min-w-[200px]"
        >
          <Sparkles className="w-5 h-5" />
          {isGenerating ? "Generating..." : "Generate Ideas"}
        </Button>
      </div>

      {/* Selected count */}
      {selectedIngredients.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-apple-gray-400 mb-8"
        >
          {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? "s" : ""} selected
        </motion.p>
      )}

      {/* Suggestions */}
      <AnimatePresence mode="wait">
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-semibold text-apple-gray-600 text-center">
              Dish Ideas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion, index) => {
                const isSaved = savedDishes.has(suggestion.name);
                return (
                  <motion.div
                    key={suggestion.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card hover className="h-full flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            <ChefHat className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-apple-gray-600">
                              {suggestion.name}
                            </h3>
                            <p className="text-xs text-apple-gray-400">
                              {suggestion.cuisine}
                            </p>
                          </div>
                        </div>
                        <Badge variant={difficultyColor[suggestion.difficulty]}>
                          {suggestion.difficulty}
                        </Badge>
                      </div>

                      <p className="text-sm text-apple-gray-500 mb-4 flex-grow">
                        {suggestion.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-apple-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {suggestion.prepTime} min
                        </div>
                      </div>

                      {/* Matched Ingredients */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider mb-2">
                          Using your ingredients
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.matchedIngredients.map((ing) => (
                            <span
                              key={ing}
                              className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Additional Ingredients Needed */}
                      {suggestion.additionalIngredients.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider mb-2">
                            You might also need
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {suggestion.additionalIngredients.map((ing) => (
                              <span
                                key={ing}
                                className="px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-xs"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        variant={isSaved ? "secondary" : "primary"}
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => handleSaveDish(suggestion)}
                        disabled={isSaved}
                      >
                        {isSaved ? (
                          <>
                            <Check className="w-4 h-4" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Save to My Dishes
                          </>
                        )}
                      </Button>
                    </Card>
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
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-apple-gray-100 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-apple-gray-300" />
          </div>
          <h3 className="text-xl font-medium text-apple-gray-500 mb-2">
            Start by selecting ingredients
          </h3>
          <p className="text-apple-gray-400 max-w-md mx-auto">
            Choose the ingredients you have on hand, and we&apos;ll suggest delicious
            dishes you can make with them.
          </p>
        </motion.div>
      )}
    </div>
  );
}
