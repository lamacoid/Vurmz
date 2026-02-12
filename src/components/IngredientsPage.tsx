"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Package, PackageX, Carrot } from "lucide-react";
import {
  addIngredient,
  toggleIngredientStock,
  deleteIngredient,
} from "@/app/actions/ingredients";
import { clsx } from "clsx";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  emoji: string | null;
  inStock: boolean;
}

interface IngredientsPageProps {
  ingredientsByCategory: Record<string, Ingredient[]>;
}

const categories = [
  "Protein",
  "Vegetable",
  "Carbs",
  "Dairy",
  "Herbs",
  "Pantry",
];

const categoryOrder = ["Protein", "Vegetable", "Carbs", "Dairy", "Herbs", "Pantry"];

const emojiSuggestions: Record<string, string> = {
  Protein: "🍗",
  Vegetable: "🥬",
  Carbs: "🍚",
  Dairy: "🥛",
  Herbs: "🌿",
  Pantry: "🫒",
};

export function IngredientsPage({ ingredientsByCategory }: IngredientsPageProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState(categories[0]);
  const [newEmoji, setNewEmoji] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    if (!newName.trim()) return;

    startTransition(async () => {
      await addIngredient({
        name: newName.trim(),
        category: newCategory,
        emoji: newEmoji || emojiSuggestions[newCategory],
      });
      setNewName("");
      setNewEmoji("");
      setIsAddingNew(false);
    });
  };

  const handleToggleStock = (id: string, currentStock: boolean) => {
    startTransition(async () => {
      await toggleIngredientStock(id, !currentStock);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteIngredient(id);
    });
  };

  const sortedCategories = Object.entries(ingredientsByCategory).sort(([a], [b]) => {
    return categoryOrder.indexOf(a) - categoryOrder.indexOf(b);
  });

  const totalIngredients = Object.values(ingredientsByCategory).flat().length;
  const inStockCount = Object.values(ingredientsByCategory).flat().filter(i => i.inStock).length;

  return (
    <div className="min-h-screen">
      <div className="pt-28 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          >
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-warm-900 tracking-tight mb-2">
                Your Pantry
              </h1>
              <p className="text-lg text-warm-500">
                {inStockCount} of {totalIngredients} ingredients in stock
              </p>
            </div>
            <button
              onClick={() => setIsAddingNew(true)}
              className="fab"
            >
              <Plus className="w-5 h-5" />
              Add Ingredient
            </button>
          </motion.div>

          {/* Add New Ingredient Modal */}
          <AnimatePresence>
            {isAddingNew && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-warm-900/20 backdrop-blur-sm px-4"
                onClick={() => setIsAddingNew(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-card w-full max-w-md rounded-3xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-warm-800">
                      Add Ingredient
                    </h2>
                    <button
                      onClick={() => setIsAddingNew(false)}
                      className="p-2 hover:bg-warm-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-warm-400" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-warm-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Avocado"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                        className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-white text-warm-800 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-warm-700 mb-2">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setNewCategory(cat)}
                            className={clsx(
                              "px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                              {
                                "bg-gradient-orange text-white shadow-glow-orange": newCategory === cat,
                                "bg-warm-100 text-warm-600 hover:bg-warm-200": newCategory !== cat,
                              }
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-warm-700 mb-2">
                        Emoji (optional)
                      </label>
                      <input
                        type="text"
                        placeholder={emojiSuggestions[newCategory]}
                        value={newEmoji}
                        onChange={(e) => setNewEmoji(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-white text-warm-800 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange transition-all"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setIsAddingNew(false)}
                        className="flex-1 py-3 px-4 rounded-xl font-medium text-sm bg-warm-100 text-warm-600 hover:bg-warm-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAdd}
                        disabled={!newName.trim() || isPending}
                        className="flex-1 py-3 px-4 rounded-xl font-medium text-sm bg-warm-800 text-white hover:bg-warm-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isPending ? "Adding..." : "Add Ingredient"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ingredient List */}
          <div className="space-y-10">
            {sortedCategories.map(([category, ingredients], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.08, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-semibold text-warm-800">
                    {category}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-warm-100 text-warm-500 text-xs font-medium">
                    {ingredients.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.08 + index * 0.03 }}
                      className={clsx(
                        "glass-card rounded-2xl px-4 py-3 flex items-center justify-between group",
                        "transition-all duration-200 hover:-translate-y-0.5",
                        { "opacity-50": !ingredient.inStock }
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ingredient.emoji}</span>
                        <span
                          className={clsx("font-medium", {
                            "text-warm-800": ingredient.inStock,
                            "text-warm-400 line-through": !ingredient.inStock,
                          })}
                        >
                          {ingredient.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleStock(ingredient.id, ingredient.inStock)}
                          className={clsx(
                            "p-2 rounded-lg transition-colors",
                            ingredient.inStock
                              ? "hover:bg-accent-amber/10 text-accent-amber"
                              : "hover:bg-accent-emerald/10 text-accent-emerald"
                          )}
                          title={ingredient.inStock ? "Mark as out of stock" : "Mark as in stock"}
                        >
                          {ingredient.inStock ? (
                            <PackageX className="w-4 h-4" />
                          ) : (
                            <Package className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(ingredient.id)}
                          className="p-2 rounded-lg hover:bg-accent-rose/10 text-accent-rose transition-colors"
                          title="Delete ingredient"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {Object.keys(ingredientsByCategory).length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-orange opacity-20 rounded-full blur-xl animate-pulse-soft" />
                <div className="relative w-24 h-24 rounded-full bg-warm-100 flex items-center justify-center">
                  <Carrot className="w-10 h-10 text-warm-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-warm-700 mb-2">
                Your pantry is empty
              </h3>
              <p className="text-warm-500 max-w-sm mx-auto mb-6">
                Start by adding the ingredients you have in your kitchen.
              </p>
              <button onClick={() => setIsAddingNew(true)} className="fab">
                <Plus className="w-5 h-5" />
                Add Your First Ingredient
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
