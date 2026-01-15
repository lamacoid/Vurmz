// Simple in-memory store with JSON file persistence

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "data.json");

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  emoji: string | null;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dish {
  id: string;
  name: string;
  description: string | null;
  cuisine: string | null;
  difficulty: string;
  prepTime: number | null;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  ingredientIds: string[];
}

interface Data {
  ingredients: Ingredient[];
  dishes: Dish[];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function loadData(): Data {
  if (existsSync(DATA_FILE)) {
    try {
      const raw = readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(raw);
      return {
        ingredients: data.ingredients.map((i: Ingredient) => ({
          ...i,
          createdAt: new Date(i.createdAt),
          updatedAt: new Date(i.updatedAt),
        })),
        dishes: data.dishes.map((d: Dish) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        })),
      };
    } catch {
      return getDefaultData();
    }
  }
  return getDefaultData();
}

function saveData(data: Data): void {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getDefaultData(): Data {
  const now = new Date();
  const defaultIngredients: Ingredient[] = [
    // Proteins
    { id: generateId(), name: "Chicken Breast", category: "Protein", emoji: "🍗", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Salmon", category: "Protein", emoji: "🐟", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Ground Beef", category: "Protein", emoji: "🥩", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Shrimp", category: "Protein", emoji: "🦐", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Tofu", category: "Protein", emoji: "🧈", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Eggs", category: "Protein", emoji: "🥚", inStock: true, createdAt: now, updatedAt: now },

    // Vegetables
    { id: generateId(), name: "Garlic", category: "Vegetable", emoji: "🧄", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Onion", category: "Vegetable", emoji: "🧅", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Tomato", category: "Vegetable", emoji: "🍅", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Bell Pepper", category: "Vegetable", emoji: "🫑", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Spinach", category: "Vegetable", emoji: "🥬", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Broccoli", category: "Vegetable", emoji: "🥦", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Mushrooms", category: "Vegetable", emoji: "🍄", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Carrots", category: "Vegetable", emoji: "🥕", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Zucchini", category: "Vegetable", emoji: "🥒", inStock: true, createdAt: now, updatedAt: now },

    // Carbs
    { id: generateId(), name: "Rice", category: "Carbs", emoji: "🍚", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Pasta", category: "Carbs", emoji: "🍝", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Bread", category: "Carbs", emoji: "🍞", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Potatoes", category: "Carbs", emoji: "🥔", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Noodles", category: "Carbs", emoji: "🍜", inStock: true, createdAt: now, updatedAt: now },

    // Dairy
    { id: generateId(), name: "Butter", category: "Dairy", emoji: "🧈", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Cheese", category: "Dairy", emoji: "🧀", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Heavy Cream", category: "Dairy", emoji: "🥛", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Milk", category: "Dairy", emoji: "🥛", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Parmesan", category: "Dairy", emoji: "🧀", inStock: true, createdAt: now, updatedAt: now },

    // Herbs
    { id: generateId(), name: "Basil", category: "Herbs", emoji: "🌿", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Cilantro", category: "Herbs", emoji: "🌿", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Thyme", category: "Herbs", emoji: "🌿", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Rosemary", category: "Herbs", emoji: "🌿", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Ginger", category: "Herbs", emoji: "🫚", inStock: true, createdAt: now, updatedAt: now },

    // Pantry
    { id: generateId(), name: "Olive Oil", category: "Pantry", emoji: "🫒", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Soy Sauce", category: "Pantry", emoji: "🍶", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Lemon", category: "Pantry", emoji: "🍋", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Lime", category: "Pantry", emoji: "🍋", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Honey", category: "Pantry", emoji: "🍯", inStock: true, createdAt: now, updatedAt: now },
    { id: generateId(), name: "Coconut Milk", category: "Pantry", emoji: "🥥", inStock: true, createdAt: now, updatedAt: now },
  ];

  const data = { ingredients: defaultIngredients, dishes: [] };
  saveData(data);
  return data;
}

// Ingredients
export function getIngredients(): Ingredient[] {
  const data = loadData();
  return data.ingredients.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });
}

export function getIngredientsGroupedByCategory(): Record<string, Ingredient[]> {
  const ingredients = getIngredients();
  const grouped: Record<string, Ingredient[]> = {};
  for (const ingredient of ingredients) {
    if (!grouped[ingredient.category]) {
      grouped[ingredient.category] = [];
    }
    grouped[ingredient.category].push(ingredient);
  }
  return grouped;
}

export function addIngredient(input: { name: string; category: string; emoji?: string }): Ingredient {
  const data = loadData();
  const now = new Date();
  const ingredient: Ingredient = {
    id: generateId(),
    name: input.name,
    category: input.category,
    emoji: input.emoji || null,
    inStock: true,
    createdAt: now,
    updatedAt: now,
  };
  data.ingredients.push(ingredient);
  saveData(data);
  return ingredient;
}

export function toggleIngredientStock(id: string, inStock: boolean): Ingredient | null {
  const data = loadData();
  const ingredient = data.ingredients.find((i) => i.id === id);
  if (ingredient) {
    ingredient.inStock = inStock;
    ingredient.updatedAt = new Date();
    saveData(data);
  }
  return ingredient || null;
}

export function deleteIngredient(id: string): void {
  const data = loadData();
  data.ingredients = data.ingredients.filter((i) => i.id !== id);
  saveData(data);
}

// Dishes
export function getDishes() {
  const data = loadData();
  return data.dishes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((dish) => ({
      ...dish,
      ingredients: dish.ingredientIds
        .map((id) => {
          const ingredient = data.ingredients.find((i) => i.id === id);
          return ingredient ? { id: generateId(), ingredient } : null;
        })
        .filter(Boolean),
    }));
}

export function createDish(input: {
  name: string;
  description?: string;
  cuisine?: string;
  difficulty?: string;
  prepTime?: number;
  ingredientIds: string[];
}): Dish {
  const data = loadData();
  const now = new Date();
  const dish: Dish = {
    id: generateId(),
    name: input.name,
    description: input.description || null,
    cuisine: input.cuisine || null,
    difficulty: input.difficulty || "Medium",
    prepTime: input.prepTime || null,
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
    ingredientIds: input.ingredientIds,
  };
  data.dishes.push(dish);
  saveData(data);
  return dish;
}

export function toggleFavorite(id: string, isFavorite: boolean): Dish | null {
  const data = loadData();
  const dish = data.dishes.find((d) => d.id === id);
  if (dish) {
    dish.isFavorite = isFavorite;
    dish.updatedAt = new Date();
    saveData(data);
  }
  return dish || null;
}

export function deleteDish(id: string): void {
  const data = loadData();
  data.dishes = data.dishes.filter((d) => d.id !== id);
  saveData(data);
}
