"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Clock, Heart, Trash2, Sparkles, BookOpen } from "lucide-react";
import { toggleFavorite, deleteDish } from "@/app/actions/dishes";
import { clsx } from "clsx";
import Link from "next/link";

interface Ingredient {
  id: string;
  name: string;
  emoji: string | null;
}

interface DishIngredient {
  id: string;
  ingredient: Ingredient;
}

interface Dish {
  id: string;
  name: string;
  description: string | null;
  cuisine: string | null;
  difficulty: string;
  prepTime: number | null;
  isFavorite: boolean;
  createdAt: Date;
  ingredients: DishIngredient[];
}

interface DishesPageProps {
  dishes: Dish[];
}

export function DishesPage({ dishes }: DishesPageProps) {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const filteredDishes =
    filter === "favorites" ? dishes.filter((d) => d.isFavorite) : dishes;

  const handleToggleFavorite = (id: string, currentFavorite: boolean) => {
    startTransition(async () => {
      await toggleFavorite(id, !currentFavorite);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteDish(id);
    });
  };

  const favoritesCount = dishes.filter((d) => d.isFavorite).length;

  return (
    <div className="min-h-screen">
      <div className="pt-28 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-warm-900 tracking-tight mb-2">
              Your Recipes
            </h1>
            <p className="text-lg text-warm-500">
              {dishes.length} saved recipe{dishes.length !== 1 ? "s" : ""}
              {favoritesCount > 0 && ` · ${favoritesCount} favorite${favoritesCount !== 1 ? "s" : ""}`}
            </p>
          </motion.div>

          {/* Filter Tabs */}
          {dishes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-2 mb-8"
            >
              <button
                onClick={() => setFilter("all")}
                className={clsx(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                  {
                    "bg-warm-800 text-white shadow-soft": filter === "all",
                    "bg-warm-100 text-warm-600 hover:bg-warm-200": filter !== "all",
                  }
                )}
              >
                All Recipes
              </button>
              <button
                onClick={() => setFilter("favorites")}
                className={clsx(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
                  {
                    "bg-accent-rose text-white shadow-soft": filter === "favorites",
                    "bg-warm-100 text-warm-600 hover:bg-warm-200": filter !== "favorites",
                  }
                )}
              >
                <Heart className={clsx("w-4 h-4", { "fill-current": filter === "favorites" })} />
                Favorites
              </button>
            </motion.div>
          )}

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish, index) => (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
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
                          {dish.name}
                        </h3>
                        {dish.cuisine && (
                          <p className="text-sm text-warm-500">
                            {dish.cuisine}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(dish.id, dish.isFavorite)}
                      className={clsx(
                        "p-2 rounded-full transition-all duration-200",
                        {
                          "text-accent-rose bg-accent-rose/10": dish.isFavorite,
                          "text-warm-300 hover:text-accent-rose hover:bg-accent-rose/10": !dish.isFavorite,
                        }
                      )}
                    >
                      <Heart
                        className={clsx("w-5 h-5", {
                          "fill-current": dish.isFavorite,
                        })}
                      />
                    </button>
                  </div>

                  {/* Description */}
                  {dish.description && (
                    <p className="text-sm text-warm-600 mb-4 flex-grow leading-relaxed">
                      {dish.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      {
                        "bg-accent-emerald/10 text-accent-emerald": dish.difficulty === "Easy",
                        "bg-accent-amber/10 text-accent-amber": dish.difficulty === "Medium",
                        "bg-accent-coral/10 text-accent-coral": dish.difficulty === "Hard",
                      }
                    )}>
                      {dish.difficulty}
                    </span>
                    {dish.prepTime && (
                      <div className="flex items-center gap-1.5 text-sm text-warm-400">
                        <Clock className="w-4 h-4" />
                        {dish.prepTime} min
                      </div>
                    )}
                  </div>

                  {/* Ingredients */}
                  {dish.ingredients.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-warm-400 uppercase tracking-wider mb-2">
                        Ingredients
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {dish.ingredients.map((di) => (
                          <span
                            key={di.id}
                            className="px-2.5 py-1 bg-warm-100 text-warm-600 rounded-full text-xs font-medium"
                          >
                            {di.ingredient.emoji && (
                              <span className="mr-1">{di.ingredient.emoji}</span>
                            )}
                            {di.ingredient.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-warm-100">
                    <span className="text-xs text-warm-400">
                      Saved {new Date(dish.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(dish.id)}
                      className="p-2 rounded-lg hover:bg-accent-rose/10 text-warm-400 hover:text-accent-rose transition-colors"
                      title="Delete recipe"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {dishes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-orange opacity-20 rounded-full blur-xl animate-pulse-soft" />
                <div className="relative w-24 h-24 rounded-full bg-warm-100 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-warm-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-warm-700 mb-2">
                No recipes saved yet
              </h3>
              <p className="text-warm-500 max-w-sm mx-auto mb-6">
                Head over to Brainstorm to discover recipe ideas and save your favorites.
              </p>
              <Link href="/">
                <button className="fab">
                  <Sparkles className="w-5 h-5" />
                  Start Brainstorming
                </button>
              </Link>
            </motion.div>
          )}

          {/* Empty Favorites State */}
          {dishes.length > 0 && filteredDishes.length === 0 && filter === "favorites" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-accent-rose opacity-20 rounded-full blur-xl animate-pulse-soft" />
                <div className="relative w-24 h-24 rounded-full bg-warm-100 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-warm-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-warm-700 mb-2">
                No favorites yet
              </h3>
              <p className="text-warm-500 max-w-sm mx-auto">
                Tap the heart icon on any recipe to add it to your favorites.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
