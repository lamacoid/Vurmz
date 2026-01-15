"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Package, PackageX } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
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

  return (
    <div>
      <PageHeader
        title="Ingredients"
        subtitle="Manage your pantry and track what's in stock"
        action={
          <Button onClick={() => setIsAddingNew(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Ingredient
          </Button>
        }
      />

      {/* Add New Ingredient Modal */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            onClick={() => setIsAddingNew(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-[400px] shadow-apple-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-apple-gray-600">
                    Add Ingredient
                  </h2>
                  <button
                    onClick={() => setIsAddingNew(false)}
                    className="p-2 hover:bg-apple-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-apple-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Name"
                    placeholder="e.g., Avocado"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                  />

                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 mb-2">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setNewCategory(cat)}
                          className={clsx(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                            {
                              "bg-apple-blue text-white": newCategory === cat,
                              "bg-apple-gray-100 text-apple-gray-500 hover:bg-apple-gray-200":
                                newCategory !== cat,
                            }
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Emoji (optional)"
                    placeholder={emojiSuggestions[newCategory]}
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setIsAddingNew(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleAdd}
                      disabled={!newName.trim() || isPending}
                    >
                      {isPending ? "Adding..." : "Add Ingredient"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ingredient List */}
      <div className="space-y-8">
        {Object.entries(ingredientsByCategory).map(([category, ingredients], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-apple-gray-600">
                {category}
              </h2>
              <Badge>{ingredients.length}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ingredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    padding="sm"
                    className={clsx("flex items-center justify-between group", {
                      "opacity-60": !ingredient.inStock,
                    })}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ingredient.emoji}</span>
                      <span
                        className={clsx("font-medium", {
                          "text-apple-gray-600": ingredient.inStock,
                          "text-apple-gray-400 line-through": !ingredient.inStock,
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
                            ? "hover:bg-orange-50 text-orange-500"
                            : "hover:bg-green-50 text-green-500"
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
                        className="p-2 rounded-lg hover:bg-red-50 text-apple-red transition-colors"
                        title="Delete ingredient"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
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
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-apple-gray-100 flex items-center justify-center">
            <Package className="w-10 h-10 text-apple-gray-300" />
          </div>
          <h3 className="text-xl font-medium text-apple-gray-500 mb-2">
            No ingredients yet
          </h3>
          <p className="text-apple-gray-400 max-w-md mx-auto mb-6">
            Start by adding the ingredients you have in your kitchen.
          </p>
          <Button onClick={() => setIsAddingNew(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Ingredient
          </Button>
        </motion.div>
      )}
    </div>
  );
}
