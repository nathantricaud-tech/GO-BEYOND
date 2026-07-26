import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  real,
  timestamp,
  date,
  boolean,
} from "drizzle-orm/pg-core";

// User accounts (email + password)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User profiles with body metrics
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  age: integer("age").notNull(),
  weight: real("weight").notNull(),
  height: real("height").notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  activityLevel: varchar("activity_level", { length: 30 }).notNull(),
  goal: varchar("goal", { length: 30 }).notNull(),
  targetWeight: real("target_weight"),
  dailyCalorieTarget: integer("daily_calorie_target"),
  avatar: varchar("avatar", { length: 30 }), // original hero-archetype id, see lib/avatars.ts
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Food log entries
export const foodLogs = pgTable("food_logs", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => userProfiles.id).notNull(),
  foodName: varchar("food_name", { length: 200 }).notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein").default(0),
  carbs: real("carbs").default(0),
  fat: real("fat").default(0),
  fiber: real("fiber").default(0),
  servingSize: varchar("serving_size", { length: 100 }),
  mealType: varchar("meal_type", { length: 30 }).notNull(),
  logDate: date("log_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Meal plans
export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => userProfiles.id).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  totalCalories: integer("total_calories").notNull(),
  totalProtein: real("total_protein"),
  totalCarbs: real("total_carbs"),
  totalFat: real("total_fat"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Meal plan items
export const mealPlanItems = pgTable("meal_plan_items", {
  id: serial("id").primaryKey(),
  mealPlanId: integer("meal_plan_id").references(() => mealPlans.id).notNull(),
  mealType: varchar("meal_type", { length: 30 }).notNull(),
  foodName: varchar("food_name", { length: 200 }).notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein").default(0),
  carbs: real("carbs").default(0),
  fat: real("fat").default(0),
  servingSize: varchar("serving_size", { length: 100 }),
  recipe: text("recipe"),
});

// Weight tracking
export const weightLogs = pgTable("weight_logs", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => userProfiles.id).notNull(),
  weight: real("weight").notNull(),
  logDate: date("log_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Water tracking
export const waterLogs = pgTable("water_logs", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => userProfiles.id).notNull(),
  glasses: integer("glasses").notNull().default(0),
  logDate: date("log_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Monthly progress photos (gallery)
export const progressPhotos = pgTable("progress_photos", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => userProfiles.id).notNull(),
  photoData: text("photo_data").notNull(), // base64 data URL, resized client-side before upload
  monthKey: varchar("month_key", { length: 7 }).notNull(), // e.g. "2026-07"
  note: varchar("note", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const workoutLogs = pgTable("workout_logs", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => userProfiles.id).notNull(),
  exerciseName: varchar("exercise_name", { length: 200 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  duration: integer("duration").notNull(), // minutes
  caloriesBurned: integer("calories_burned").default(0),
  sets: integer("sets"),
  reps: varchar("reps", { length: 50 }),
  weight_used: real("weight_used"), // kg
  notes: text("notes"),
  logDate: date("log_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
