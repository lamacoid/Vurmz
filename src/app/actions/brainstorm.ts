"use server";

// Dish suggestion logic based on selected ingredients
// This generates creative dish ideas from the ingredients you have

interface Ingredient {
  id: string;
  name: string;
  category: string;
  emoji?: string | null;
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

// Recipe templates with required and optional ingredients
const recipeTemplates = [
  {
    name: "Classic Stir Fry",
    cuisine: "Asian",
    difficulty: "Easy" as const,
    prepTime: 20,
    required: ["protein", "vegetable"],
    optional: ["Garlic", "Ginger", "Soy Sauce"],
    description: "Quick and flavorful stir fry with your choice of protein and vegetables",
  },
  {
    name: "Creamy Pasta",
    cuisine: "Italian",
    difficulty: "Easy" as const,
    prepTime: 25,
    required: ["Pasta", "dairy"],
    optional: ["Garlic", "Parmesan", "protein"],
    description: "Rich and creamy pasta with a velvety sauce",
  },
  {
    name: "Mediterranean Bowl",
    cuisine: "Mediterranean",
    difficulty: "Easy" as const,
    prepTime: 15,
    required: ["Rice", "vegetable"],
    optional: ["Olive Oil", "Lemon", "Herbs"],
    description: "Fresh and healthy grain bowl with Mediterranean flavors",
  },
  {
    name: "Thai Curry",
    cuisine: "Thai",
    difficulty: "Medium" as const,
    prepTime: 35,
    required: ["Coconut Milk", "protein"],
    optional: ["Ginger", "Basil", "vegetable"],
    description: "Aromatic curry with creamy coconut milk base",
  },
  {
    name: "Herb-Crusted Protein",
    cuisine: "French",
    difficulty: "Medium" as const,
    prepTime: 40,
    required: ["protein", "herb"],
    optional: ["Butter", "Garlic", "Lemon"],
    description: "Elegant main course with a fragrant herb crust",
  },
  {
    name: "Vegetable Frittata",
    cuisine: "Italian",
    difficulty: "Easy" as const,
    prepTime: 25,
    required: ["Eggs", "vegetable"],
    optional: ["Cheese", "Herbs", "Onion"],
    description: "Fluffy egg dish loaded with fresh vegetables",
  },
  {
    name: "Asian Noodle Soup",
    cuisine: "Asian",
    difficulty: "Medium" as const,
    prepTime: 30,
    required: ["Noodles", "protein"],
    optional: ["Ginger", "Soy Sauce", "vegetable"],
    description: "Warming noodle soup with rich umami broth",
  },
  {
    name: "Stuffed Bell Peppers",
    cuisine: "American",
    difficulty: "Medium" as const,
    prepTime: 45,
    required: ["Bell Pepper", "Rice"],
    optional: ["Ground Beef", "Tomato", "Cheese"],
    description: "Colorful peppers filled with savory rice mixture",
  },
  {
    name: "Garlic Butter Shrimp",
    cuisine: "American",
    difficulty: "Easy" as const,
    prepTime: 15,
    required: ["Shrimp", "Butter", "Garlic"],
    optional: ["Lemon", "Herbs", "Pasta"],
    description: "Succulent shrimp in a rich garlic butter sauce",
  },
  {
    name: "Mushroom Risotto",
    cuisine: "Italian",
    difficulty: "Hard" as const,
    prepTime: 45,
    required: ["Rice", "Mushrooms"],
    optional: ["Parmesan", "Butter", "Onion"],
    description: "Creamy Italian rice dish with earthy mushrooms",
  },
  {
    name: "Honey Glazed Salmon",
    cuisine: "Asian Fusion",
    difficulty: "Medium" as const,
    prepTime: 25,
    required: ["Salmon", "Honey"],
    optional: ["Soy Sauce", "Ginger", "Garlic"],
    description: "Perfectly glazed salmon with sweet and savory notes",
  },
  {
    name: "Chicken Piccata",
    cuisine: "Italian",
    difficulty: "Medium" as const,
    prepTime: 30,
    required: ["Chicken Breast", "Lemon", "Butter"],
    optional: ["Pasta", "Garlic", "Herbs"],
    description: "Tender chicken in a bright lemon butter sauce",
  },
  {
    name: "Tofu Buddha Bowl",
    cuisine: "Asian Fusion",
    difficulty: "Easy" as const,
    prepTime: 20,
    required: ["Tofu", "Rice", "vegetable"],
    optional: ["Soy Sauce", "Ginger", "Sesame"],
    description: "Nourishing bowl with crispy tofu and fresh vegetables",
  },
  {
    name: "Beef & Broccoli",
    cuisine: "Chinese",
    difficulty: "Easy" as const,
    prepTime: 20,
    required: ["Ground Beef", "Broccoli"],
    optional: ["Soy Sauce", "Garlic", "Ginger"],
    description: "Classic Chinese takeout made at home",
  },
  {
    name: "Spinach & Cheese Omelette",
    cuisine: "French",
    difficulty: "Easy" as const,
    prepTime: 10,
    required: ["Eggs", "Spinach", "Cheese"],
    optional: ["Butter", "Herbs"],
    description: "Light and fluffy omelette with nutritious spinach",
  },
];

const categoryMap: Record<string, string> = {
  Protein: "protein",
  Vegetable: "vegetable",
  Carbs: "carb",
  Dairy: "dairy",
  Herbs: "herb",
  Pantry: "pantry",
};

export async function generateDishSuggestions(
  selectedIngredients: Ingredient[]
): Promise<DishSuggestion[]> {
  const ingredientNames = selectedIngredients.map((i) => i.name);
  const ingredientCategories = [...new Set(selectedIngredients.map((i) => categoryMap[i.category] || i.category.toLowerCase()))];

  const suggestions: DishSuggestion[] = [];

  for (const template of recipeTemplates) {
    let matchScore = 0;
    const matchedIngredients: string[] = [];
    const additionalIngredients: string[] = [];

    // Check required ingredients
    let hasAllRequired = true;
    for (const req of template.required) {
      const isCategory = !req.includes(" ");
      if (isCategory) {
        // It's a category like "protein" or "vegetable"
        if (ingredientCategories.includes(req.toLowerCase())) {
          matchScore += 2;
          const matched = selectedIngredients.find(
            (i) => categoryMap[i.category]?.toLowerCase() === req.toLowerCase()
          );
          if (matched) matchedIngredients.push(matched.name);
        } else {
          hasAllRequired = false;
          additionalIngredients.push(`Any ${req}`);
        }
      } else {
        // It's a specific ingredient
        if (ingredientNames.includes(req)) {
          matchScore += 3;
          matchedIngredients.push(req);
        } else {
          hasAllRequired = false;
          additionalIngredients.push(req);
        }
      }
    }

    // Check optional ingredients for bonus points
    for (const opt of template.optional) {
      const isCategory = !opt.includes(" ");
      if (isCategory) {
        if (ingredientCategories.includes(opt.toLowerCase())) {
          matchScore += 1;
          const matched = selectedIngredients.find(
            (i) => categoryMap[i.category]?.toLowerCase() === opt.toLowerCase()
          );
          if (matched && !matchedIngredients.includes(matched.name)) {
            matchedIngredients.push(matched.name);
          }
        }
      } else {
        if (ingredientNames.includes(opt)) {
          matchScore += 1;
          if (!matchedIngredients.includes(opt)) {
            matchedIngredients.push(opt);
          }
        }
      }
    }

    // Only suggest if we have at least one required ingredient
    if (matchScore >= 2) {
      suggestions.push({
        name: template.name,
        description: template.description,
        cuisine: template.cuisine,
        difficulty: template.difficulty,
        prepTime: template.prepTime,
        matchedIngredients,
        additionalIngredients: hasAllRequired ? [] : additionalIngredients,
      });
    }
  }

  // Sort by match score (best matches first) and return top 6
  return suggestions
    .sort((a, b) => b.matchedIngredients.length - a.matchedIngredients.length)
    .slice(0, 6);
}
