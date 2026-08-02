import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { progressPhotos } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    if (!profileId) {
      return NextResponse.json({ error: "profileId is required" }, { status: 400 });
    }

    const photos = await db
      .select()
      .from(progressPhotos)
      .where(eq(progressPhotos.profileId, parseInt(profileId)))
      .orderBy(desc(progressPhotos.monthKey));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, photoData, note } = body;

    if (!profileId || !photoData) {
      return NextResponse.json({ error: "profileId and photoData are required" }, { status: 400 });
    }
    // 5MB safety cap on the base64 string (Postgres text column, keeps things sane)
    if (typeof photoData === "string" && photoData.length > 5_000_000) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    const monthKey = new Date().toISOString().slice(0, 7); // "2026-07"

    // One photo per calendar month: replace if one already exists for this month.
    const existing = await db
      .select()
      .from(progressPhotos)
      .where(and(eq(progressPhotos.profileId, profileId), eq(progressPhotos.monthKey, monthKey)));

    if (existing.length > 0) {
      const [updated] = await db
        .update(progressPhotos)
        .set({ photoData, note: note || null })
        .where(eq(progressPhotos.id, existing[0].id))
        .returning();
      return NextResponse.json({ photo: updated, replaced: true });
    }

    const [created] = await db
      .insert(progressPhotos)
      .values({ profileId, photoData, monthKey, note: note || null })
      .returning();

    return NextResponse.json({ photo: created, replaced: false });
  } catch (error) {
    console.error("Error saving progress photo:", error);
    return NextResponse.json({ error: "Failed to save photo" }, { status: 500 });
  }
}
