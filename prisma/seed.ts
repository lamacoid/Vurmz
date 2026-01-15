import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ingredients = [
  // Proteins
  { name: "Chicken Breast", category: "Protein", emoji: "🍗" },
  { name: "Salmon", category: "Protein", emoji: "🐟" },
  { name: "Ground Beef", category: "Protein", emoji: "🥩" },
  { name: "Shrimp", category: "Protein", emoji: "🦐" },
  { name: "Tofu", category: "Protein", emoji: "🧈" },
  { name: "Eggs", category: "Protein", emoji: "🥚" },

  // Vegetables
  { name: "Garlic", category: "Vegetable", emoji: "🧄" },
  { name: "Onion", category: "Vegetable", emoji: "🧅" },
  { name: "Tomato", category: "Vegetable", emoji: "🍅" },
  { name: "Bell Pepper", category: "Vegetable", emoji: "🫑" },
  { name: "Spinach", category: "Vegetable", emoji: "🥬" },
  { name: "Broccoli", category: "Vegetable", emoji: "🥦" },
  { name: "Mushrooms", category: "Vegetable", emoji: "🍄" },
  { name: "Carrots", category: "Vegetable", emoji: "🥕" },
  { name: "Zucchini", category: "Vegetable", emoji: "🥒" },

  // Carbs
  { name: "Rice", category: "Carbs", emoji: "🍚" },
  { name: "Pasta", category: "Carbs", emoji: "🍝" },
  { name: "Bread", category: "Carbs", emoji: "🍞" },
  { name: "Potatoes", category: "Carbs", emoji: "🥔" },
  { name: "Noodles", category: "Carbs", emoji: "🍜" },

  // Dairy
  { name: "Butter", category: "Dairy", emoji: "🧈" },
  { name: "Cheese", category: "Dairy", emoji: "🧀" },
  { name: "Heavy Cream", category: "Dairy", emoji: "🥛" },
  { name: "Milk", category: "Dairy", emoji: "🥛" },
  { name: "Parmesan", category: "Dairy", emoji: "🧀" },

  // Herbs & Spices
  { name: "Basil", category: "Herbs", emoji: "🌿" },
  { name: "Cilantro", category: "Herbs", emoji: "🌿" },
  { name: "Thyme", category: "Herbs", emoji: "🌿" },
  { name: "Rosemary", category: "Herbs", emoji: "🌿" },
  { name: "Ginger", category: "Herbs", emoji: "🫚" },

  // Pantry
  { name: "Olive Oil", category: "Pantry", emoji: "🫒" },
  { name: "Soy Sauce", category: "Pantry", emoji: "🍶" },
  { name: "Lemon", category: "Pantry", emoji: "🍋" },
  { name: "Lime", category: "Pantry", emoji: "🍋" },
  { name: "Honey", category: "Pantry", emoji: "🍯" },
  { name: "Coconut Milk", category: "Pantry", emoji: "🥥" },
];

async function main() {
  console.log("🌱 Seeding database...");

  for (const ingredient of ingredients) {
    await prisma.ingredient.upsert({
      where: { name: ingredient.name },
      update: {},
      create: ingredient,
    });
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
