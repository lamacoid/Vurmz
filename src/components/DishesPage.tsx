"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Clock, Heart, Trash2, Sparkles } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
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

  const difficultyColor = {
    Easy: "success",
    Medium: "warning",
    Hard: "info",
  } as const;

  return (
    <div>
      <PageHeader
        title="My Dishes"
        subtitle="Your saved dish ideas and favorites"
      />

      {/* Filter Tabs */}
      {dishes.length > 0 && (
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              {
                "bg-apple-gray-600 text-white": filter === "all",
                "bg-apple-gray-100 text-apple-gray-500 hover:bg-apple-gray-200":
                  filter !== "all",
              }
            )}
          >
            All Dishes ({dishes.length})
          </button>
          <button
            onClick={() => setFilter("favorites")}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              {
                "bg-apple-red text-white": filter === "favorites",
                "bg-apple-gray-100 text-apple-gray-500 hover:bg-apple-gray-200":
                  filter !== "favorites",
              }
            )}
          >
            <Heart className="w-4 h-4" />
            Favorites ({dishes.filter((d) => d.isFavorite).length})
          </button>
        </div>
      )}

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-apple-gray-600 text-lg">
                        {dish.name}
                      </h3>
                      {dish.cuisine && (
                        <p className="text-sm text-apple-gray-400">
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
                        "text-apple-red bg-red-50": dish.isFavorite,
                        "text-apple-gray-300 hover:text-apple-red hover:bg-red-50":
                          !dish.isFavorite,
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

                {dish.description && (
                  <p className="text-sm text-apple-gray-500 mb-4 flex-grow">
                    {dish.description}
                  </p>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    variant={
                      difficultyColor[dish.difficulty as keyof typeof difficultyColor] ||
                      "default"
                    }
                  >
                    {dish.difficulty}
                  </Badge>
                  {dish.prepTime && (
                    <div className="flex items-center gap-1 text-sm text-apple-gray-400">
                      <Clock className="w-4 h-4" />
                      {dish.prepTime} min
                    </div>
                  )}
                </div>

                {/* Ingredients */}
                {dish.ingredients.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider mb-2">
                      Ingredients
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {dish.ingredients.map((di) => (
                        <span
                          key={di.id}
                          className="px-2 py-1 bg-apple-gray-100 text-apple-gray-600 rounded-md text-xs"
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

                <div className="flex items-center justify-between pt-4 border-t border-apple-gray-100">
                  <span className="text-xs text-apple-gray-400">
                    Added {new Date(dish.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(dish.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-apple-gray-400 hover:text-apple-red transition-colors"
                    title="Delete dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {dishes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-apple-gray-100 flex items-center justify-center">
            <ChefHat className="w-10 h-10 text-apple-gray-300" />
          </div>
          <h3 className="text-xl font-medium text-apple-gray-500 mb-2">
            No dishes saved yet
          </h3>
          <p className="text-apple-gray-400 max-w-md mx-auto mb-6">
            Head over to Brainstorm to generate dish ideas and save your favorites.
          </p>
          <Link href="/">
            <Button className="gap-2">
              <Sparkles className="w-4 h-4" />
              Start Brainstorming
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Empty Favorites State */}
      {dishes.length > 0 && filteredDishes.length === 0 && filter === "favorites" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-apple-gray-100 flex items-center justify-center">
            <Heart className="w-10 h-10 text-apple-gray-300" />
          </div>
          <h3 className="text-xl font-medium text-apple-gray-500 mb-2">
            No favorites yet
          </h3>
          <p className="text-apple-gray-400 max-w-md mx-auto">
            Click the heart icon on any dish to add it to your favorites.
          </p>
        </motion.div>
      )}
    </div>
  );
}
