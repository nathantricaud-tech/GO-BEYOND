import { NextRequest, NextResponse } from "next/server";
import { foodDatabase } from "@/lib/food-db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: "query is required" },
        { status: 400 }
      );
    }

    const searchTerm = query.toLowerCase().trim();
    const searchWords = searchTerm.split(/[\s_-]+/);

    // Score-based search for better matching
    const scoredResults = Object.entries(foodDatabase)
      .map(([key, food]) => {
        let score = 0;
        const keyLower = key.toLowerCase();
        const nameLower = food.name.toLowerCase();
        const categoryLower = food.category.toLowerCase();

        // Exact match on key = highest score
        if (keyLower === searchTerm) score += 100;

        // Exact match on name
        if (nameLower === searchTerm) score += 90;

        // Key starts with search term
        if (keyLower.startsWith(searchTerm)) score += 50;

        // Name starts with search term
        if (nameLower.startsWith(searchTerm)) score += 45;

        // Key contains search term
        if (keyLower.includes(searchTerm)) score += 30;

        // Name contains search term
        if (nameLower.includes(searchTerm)) score += 25;

        // Category matches
        if (categoryLower.includes(searchTerm)) score += 15;

        // Word-by-word matching
        for (const word of searchWords) {
          if (word.length < 2) continue;
          if (keyLower.includes(word)) score += 10;
          if (nameLower.includes(word)) score += 8;
          if (categoryLower.includes(word)) score += 5;
        }

        return {
          food: {
            name: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            fiber: food.fiber,
            serving: food.serving,
            category: food.category,
            emoji: food.emoji,
            key,
          },
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)
      .map((item) => item.food);

    return NextResponse.json({ results: scoredResults });
  } catch (error) {
    console.error("Error scanning food:", error);
    return NextResponse.json(
      { error: "Failed to scan food" },
      { status: 500 }
    );
  }
}
