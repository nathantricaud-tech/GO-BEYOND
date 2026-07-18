// ══════════════════════════════════════════════════════════════
// EXERCISE DATABASE — 60+ exercises organized by muscle group
// ══════════════════════════════════════════════════════════════

export interface Exercise {
  id: string;
  name: string;
  category: "strength" | "cardio" | "flexibility" | "hiit" | "calisthenics";
  muscleGroup: string;
  muscles: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: string;
  caloriesPer30: number;
  defaultSets: number;
  defaultReps: string;
  description: string;
  steps: string[];
  tips: string[];

  emoji: string;
  forGoals: ("lose_weight" | "gain_muscle" | "maintain")[];
}

export const exercises: Exercise[] = [
  // ══════ CHEST ══════
  { id: "c1", name: "Push-Ups", category: "calisthenics", muscleGroup: "Chest", muscles: ["Pectorals", "Triceps", "Anterior Delts"], difficulty: "beginner", equipment: "None", caloriesPer30: 100, defaultSets: 4, defaultReps: "12-15", description: "The king of bodyweight exercises. Targets your entire upper body push chain.", steps: ["Start in plank with hands shoulder-width", "Lower chest to floor, elbows at 45°", "Push back up explosively", "Fully extend arms at top"], tips: ["Keep core tight, body in a straight line", "Don't let hips sag", "Breathe in going down, out going up"], emoji: "💪", forGoals: ["gain_muscle", "maintain"] },
  { id: "c2", name: "Bench Press", category: "strength", muscleGroup: "Chest", muscles: ["Pectorals", "Triceps", "Anterior Delts"], difficulty: "intermediate", equipment: "Barbell + Bench", caloriesPer30: 120, defaultSets: 4, defaultReps: "8-12", description: "The fundamental chest builder. Compound movement for upper body mass.", steps: ["Lie flat on bench, feet on floor", "Grip bar slightly wider than shoulders", "Unrack and lower to mid-chest", "Press up to lockout"], tips: ["Retract shoulder blades", "Arch your upper back slightly", "Don't bounce off chest"], emoji: "🏋️", forGoals: ["gain_muscle"] },
  { id: "c3", name: "Dumbbell Flyes", category: "strength", muscleGroup: "Chest", muscles: ["Pectorals", "Anterior Delts"], difficulty: "intermediate", equipment: "Dumbbells + Bench", caloriesPer30: 90, defaultSets: 3, defaultReps: "10-12", description: "Isolation exercise that stretches and contracts the chest muscles.", steps: ["Lie on bench with dumbbells above chest", "Slight bend in elbows", "Lower arms in wide arc to sides", "Squeeze chest to bring weights back up"], tips: ["Don't go too heavy — focus on stretch", "Keep slight bend in elbows throughout"], emoji: "🦅", forGoals: ["gain_muscle"] },
  { id: "c4", name: "Incline Push-Ups", category: "calisthenics", muscleGroup: "Chest", muscles: ["Lower Chest", "Triceps"], difficulty: "beginner", equipment: "Bench or Step", caloriesPer30: 80, defaultSets: 3, defaultReps: "15-20", description: "Easier push-up variation, great for beginners building chest strength.", steps: ["Place hands on elevated surface", "Body straight from head to heels", "Lower chest toward surface", "Push back to start"], tips: ["Higher surface = easier", "Great warm-up before harder exercises"], emoji: "📐", forGoals: ["gain_muscle", "maintain"] },
  { id: "c5", name: "Diamond Push-Ups", category: "calisthenics", muscleGroup: "Chest", muscles: ["Inner Chest", "Triceps"], difficulty: "intermediate", equipment: "None", caloriesPer30: 110, defaultSets: 3, defaultReps: "8-12", description: "Close-grip push-up that emphasizes triceps and inner chest.", steps: ["Hands together, forming a diamond shape", "Lower chest to hands", "Push back up", "Keep elbows close to body"], tips: ["If too hard, start on knees", "Focus on squeezing triceps at top"], emoji: "💎", forGoals: ["gain_muscle"] },

  // ══════ BACK ══════
  { id: "b1", name: "Pull-Ups", category: "calisthenics", muscleGroup: "Back", muscles: ["Lats", "Biceps", "Rear Delts"], difficulty: "advanced", equipment: "Pull-up Bar", caloriesPer30: 130, defaultSets: 4, defaultReps: "6-10", description: "The ultimate back builder. If you can only do one exercise, do this.", steps: ["Grab bar overhand, wider than shoulders", "Hang fully extended", "Pull chin above bar", "Lower slowly with control"], tips: ["Initiate with back, not biceps", "Avoid swinging", "Use resistance band if needed"], emoji: "🤸", forGoals: ["gain_muscle"] },
  { id: "b2", name: "Bent-Over Rows", category: "strength", muscleGroup: "Back", muscles: ["Lats", "Rhomboids", "Biceps", "Rear Delts"], difficulty: "intermediate", equipment: "Barbell or Dumbbells", caloriesPer30: 110, defaultSets: 4, defaultReps: "8-12", description: "Powerful horizontal pulling movement for a thick back.", steps: ["Hinge at hips, back flat at 45°", "Pull weight to lower chest/upper abs", "Squeeze shoulder blades at top", "Lower with control"], tips: ["Keep back flat, don't round", "Pull with elbows, not hands"], emoji: "🚣", forGoals: ["gain_muscle"] },
  { id: "b3", name: "Lat Pulldown", category: "strength", muscleGroup: "Back", muscles: ["Lats", "Biceps"], difficulty: "beginner", equipment: "Cable Machine", caloriesPer30: 90, defaultSets: 3, defaultReps: "10-12", description: "Machine version of pull-ups. Great for building to full pull-ups.", steps: ["Grip bar wide, sit with thighs secured", "Pull bar to upper chest", "Lean slightly back", "Return slowly to start"], tips: ["Don't lean too far back", "Focus on squeezing lats"], emoji: "📉", forGoals: ["gain_muscle", "maintain"] },
  { id: "b4", name: "Superman Hold", category: "calisthenics", muscleGroup: "Back", muscles: ["Erector Spinae", "Glutes"], difficulty: "beginner", equipment: "None", caloriesPer30: 60, defaultSets: 3, defaultReps: "15-20 sec hold", description: "Strengthens the lower back and improves posture.", steps: ["Lie face down, arms extended forward", "Lift arms, chest, and legs off floor", "Hold at the top", "Lower slowly"], tips: ["Don't hyperextend neck", "Squeeze glutes at top"], emoji: "🦸", forGoals: ["maintain", "gain_muscle"] },
  { id: "b5", name: "Inverted Rows", category: "calisthenics", muscleGroup: "Back", muscles: ["Lats", "Rhomboids", "Biceps"], difficulty: "beginner", equipment: "Low Bar or TRX", caloriesPer30: 85, defaultSets: 3, defaultReps: "10-15", description: "Bodyweight row — the horizontal pull for beginners.", steps: ["Hang under a bar at waist height", "Body straight, heels on floor", "Pull chest to bar", "Lower slowly"], tips: ["Easier with bent knees", "Great for pull-up progression"], emoji: "🔄", forGoals: ["gain_muscle", "maintain"] },

  // ══════ LEGS ══════
  { id: "l1", name: "Squats (Bodyweight)", category: "calisthenics", muscleGroup: "Legs", muscles: ["Quadriceps", "Glutes", "Hamstrings"], difficulty: "beginner", equipment: "None", caloriesPer30: 150, defaultSets: 4, defaultReps: "15-20", description: "The fundamental lower body movement pattern.", steps: ["Stand feet shoulder-width apart", "Push hips back and bend knees", "Lower until thighs parallel to floor", "Drive through heels to stand"], tips: ["Keep chest up and knees tracking over toes", "Don't let knees cave in"], emoji: "🦵", forGoals: ["lose_weight", "gain_muscle", "maintain"] },
  { id: "l2", name: "Barbell Squat", category: "strength", muscleGroup: "Legs", muscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"], difficulty: "intermediate", equipment: "Barbell + Rack", caloriesPer30: 180, defaultSets: 4, defaultReps: "6-10", description: "King of all exercises. Builds total body strength and mass.", steps: ["Bar on upper back (high bar) or rear delts (low bar)", "Unrack, step back, feet shoulder-width", "Squat to parallel or below", "Drive up powerfully"], tips: ["Keep core braced throughout", "Don't let knees cave", "Full depth > heavy weight"], emoji: "🏋️", forGoals: ["gain_muscle"] },
  { id: "l3", name: "Lunges", category: "calisthenics", muscleGroup: "Legs", muscles: ["Quadriceps", "Glutes", "Hamstrings"], difficulty: "beginner", equipment: "None", caloriesPer30: 140, defaultSets: 3, defaultReps: "12 each leg", description: "Unilateral exercise that builds balance and leg strength.", steps: ["Stand tall, step forward with one leg", "Lower until both knees at 90°", "Front knee over ankle, not past toes", "Push back to start, alternate"], tips: ["Keep torso upright", "Shorter step = more quads, longer = more glutes"], emoji: "🦿", forGoals: ["lose_weight", "gain_muscle", "maintain"] },
  { id: "l4", name: "Bulgarian Split Squat", category: "strength", muscleGroup: "Legs", muscles: ["Quadriceps", "Glutes"], difficulty: "intermediate", equipment: "Bench + optional Dumbbells", caloriesPer30: 140, defaultSets: 3, defaultReps: "10 each leg", description: "Advanced single-leg exercise for serious leg development.", steps: ["Rear foot elevated on bench", "Lower into a lunge position", "Front thigh parallel to floor", "Drive up through front heel"], tips: ["Keep most weight on front foot", "Control the descent"], emoji: "🏔️", forGoals: ["gain_muscle"] },
  { id: "l5", name: "Deadlift", category: "strength", muscleGroup: "Legs", muscles: ["Hamstrings", "Glutes", "Lower Back", "Traps"], difficulty: "intermediate", equipment: "Barbell", caloriesPer30: 180, defaultSets: 4, defaultReps: "5-8", description: "The ultimate posterior chain builder. Full body strength exercise.", steps: ["Stand with feet hip-width, bar over mid-foot", "Hinge at hips, grip bar outside knees", "Brace core, drive through legs", "Lock out hips at top"], tips: ["Keep bar close to body", "Don't round your back", "Think 'push floor away'"], emoji: "🏋️", forGoals: ["gain_muscle"] },
  { id: "l6", name: "Leg Press", category: "strength", muscleGroup: "Legs", muscles: ["Quadriceps", "Glutes"], difficulty: "beginner", equipment: "Leg Press Machine", caloriesPer30: 130, defaultSets: 4, defaultReps: "10-15", description: "Machine-based leg exercise — safer than squats for beginners.", steps: ["Sit in machine, feet shoulder-width on platform", "Unlock the safeties", "Lower platform by bending knees", "Press back up without locking knees"], tips: ["Don't lock knees at top", "Higher foot placement = more glutes"], emoji: "🦵", forGoals: ["gain_muscle", "maintain"] },
  { id: "l7", name: "Calf Raises", category: "strength", muscleGroup: "Legs", muscles: ["Calves (Gastrocnemius, Soleus)"], difficulty: "beginner", equipment: "None or Step", caloriesPer30: 60, defaultSets: 4, defaultReps: "15-20", description: "Isolates the calf muscles for definition and strength.", steps: ["Stand on edge of step, heels hanging off", "Rise up on toes as high as possible", "Hold at top for 1 second", "Lower slowly below the step level"], tips: ["Full range of motion is key", "Slow negatives for growth"], emoji: "🦶", forGoals: ["gain_muscle"] },
  { id: "l8", name: "Wall Sit", category: "calisthenics", muscleGroup: "Legs", muscles: ["Quadriceps", "Glutes"], difficulty: "beginner", equipment: "Wall", caloriesPer30: 100, defaultSets: 3, defaultReps: "30-60 sec hold", description: "Isometric hold that builds quad endurance and mental toughness.", steps: ["Lean back against wall", "Slide down until thighs parallel", "Knees at 90°, back flat on wall", "Hold as long as possible"], tips: ["Push back into wall", "Breathe steadily"], emoji: "🧱", forGoals: ["lose_weight", "maintain"] },
  { id: "l9", name: "Glute Bridge", category: "calisthenics", muscleGroup: "Legs", muscles: ["Glutes", "Hamstrings", "Core"], difficulty: "beginner", equipment: "None", caloriesPer30: 70, defaultSets: 3, defaultReps: "15-20", description: "Activates and builds the glutes, great for posture.", steps: ["Lie on back, knees bent, feet flat", "Drive hips up by squeezing glutes", "Create straight line from knees to shoulders", "Lower slowly"], tips: ["Pause at top for 2 seconds", "Don't hyperextend — squeeze glutes not back"], emoji: "🍑", forGoals: ["gain_muscle", "maintain"] },
  { id: "l10", name: "Step-Ups", category: "calisthenics", muscleGroup: "Legs", muscles: ["Quadriceps", "Glutes"], difficulty: "beginner", equipment: "Bench or Step", caloriesPer30: 120, defaultSets: 3, defaultReps: "12 each leg", description: "Functional single-leg exercise that mimics real life movements.", steps: ["Stand facing a bench/step", "Step up with one foot, drive up", "Stand fully on top", "Step down with control, alternate"], tips: ["Don't push off back foot", "Higher step = more glutes"], emoji: "⬆️", forGoals: ["lose_weight", "gain_muscle"] },

  // ══════ SHOULDERS ══════
  { id: "s1", name: "Overhead Press", category: "strength", muscleGroup: "Shoulders", muscles: ["Anterior Delts", "Lateral Delts", "Triceps"], difficulty: "intermediate", equipment: "Barbell or Dumbbells", caloriesPer30: 100, defaultSets: 4, defaultReps: "8-12", description: "The primary shoulder mass builder.", steps: ["Start with bar at shoulder level", "Press overhead to lockout", "Lower back to shoulders with control"], tips: ["Brace core tightly", "Don't arch lower back excessively"], emoji: "⬆️", forGoals: ["gain_muscle"] },
  { id: "s2", name: "Lateral Raises", category: "strength", muscleGroup: "Shoulders", muscles: ["Lateral Delts"], difficulty: "beginner", equipment: "Dumbbells", caloriesPer30: 70, defaultSets: 4, defaultReps: "12-15", description: "Isolation for wide, capped shoulders.", steps: ["Stand with dumbbells at sides", "Raise arms out to sides to shoulder height", "Slight bend in elbows", "Lower slowly"], tips: ["Use light weight, focus on contraction", "Lead with elbows not hands"], emoji: "🦅", forGoals: ["gain_muscle"] },
  { id: "s3", name: "Pike Push-Ups", category: "calisthenics", muscleGroup: "Shoulders", muscles: ["Anterior Delts", "Triceps"], difficulty: "intermediate", equipment: "None", caloriesPer30: 100, defaultSets: 3, defaultReps: "8-12", description: "Bodyweight shoulder press alternative.", steps: ["Start in downward dog position", "Bend elbows, lower head toward floor", "Push back to start", "Keep hips high throughout"], tips: ["Elevate feet for more difficulty", "Progression toward handstand push-ups"], emoji: "⛰️", forGoals: ["gain_muscle"] },

  // ══════ ARMS ══════
  { id: "a1", name: "Bicep Curls", category: "strength", muscleGroup: "Arms", muscles: ["Biceps"], difficulty: "beginner", equipment: "Dumbbells", caloriesPer30: 70, defaultSets: 3, defaultReps: "10-15", description: "Classic arm builder. Isolation for the biceps.", steps: ["Stand with dumbbells at sides, palms forward", "Curl weights to shoulders", "Squeeze at top", "Lower slowly"], tips: ["Don't swing — use strict form", "Control the negative"], emoji: "💪", forGoals: ["gain_muscle"] },
  { id: "a2", name: "Tricep Dips", category: "calisthenics", muscleGroup: "Arms", muscles: ["Triceps", "Chest", "Anterior Delts"], difficulty: "intermediate", equipment: "Parallel Bars or Bench", caloriesPer30: 110, defaultSets: 3, defaultReps: "8-15", description: "Compound movement for tricep mass. Can be done on a bench.", steps: ["Grip bars or bench edge behind you", "Lower body by bending elbows to 90°", "Push back up to lockout", "Keep elbows pointing back"], tips: ["Lean forward for more chest, upright for more triceps", "Use bench dips if too hard"], emoji: "📐", forGoals: ["gain_muscle"] },
  { id: "a3", name: "Hammer Curls", category: "strength", muscleGroup: "Arms", muscles: ["Biceps", "Brachialis", "Forearms"], difficulty: "beginner", equipment: "Dumbbells", caloriesPer30: 65, defaultSets: 3, defaultReps: "10-12", description: "Targets the brachialis for thicker arms.", steps: ["Hold dumbbells with neutral grip (palms facing each other)", "Curl up keeping palms facing in", "Squeeze at top", "Lower slowly"], tips: ["Great for forearm development too", "Alternate arms or both together"], emoji: "🔨", forGoals: ["gain_muscle"] },

  // ══════ CORE ══════
  { id: "co1", name: "Plank", category: "calisthenics", muscleGroup: "Core", muscles: ["Rectus Abdominis", "Obliques", "Transverse Abdominis"], difficulty: "beginner", equipment: "None", caloriesPer30: 60, defaultSets: 3, defaultReps: "30-60 sec", description: "The foundation of core training. Builds endurance and stability.", steps: ["Forearms on floor, elbows under shoulders", "Body in straight line head to heels", "Engage core, squeeze glutes", "Hold without sagging or piking"], tips: ["Breathe normally", "If shaking, you're working!"], emoji: "🧘", forGoals: ["lose_weight", "gain_muscle", "maintain"] },
  { id: "co2", name: "Crunches", category: "calisthenics", muscleGroup: "Core", muscles: ["Rectus Abdominis"], difficulty: "beginner", equipment: "None", caloriesPer30: 50, defaultSets: 3, defaultReps: "20-25", description: "Basic ab exercise for upper abdominal strength.", steps: ["Lie on back, knees bent, feet flat", "Hands behind head or crossed on chest", "Curl shoulders off floor", "Lower with control"], tips: ["Don't pull on your neck", "Exhale as you crunch up"], emoji: "💫", forGoals: ["gain_muscle", "maintain"] },
  { id: "co3", name: "Russian Twists", category: "calisthenics", muscleGroup: "Core", muscles: ["Obliques", "Rectus Abdominis"], difficulty: "intermediate", equipment: "None or Weight", caloriesPer30: 80, defaultSets: 3, defaultReps: "20 total (10 each side)", description: "Rotational core exercise for oblique definition.", steps: ["Sit with knees bent, lean back 45°", "Lift feet off floor (optional)", "Rotate torso side to side", "Touch floor beside hip each side"], tips: ["Keep chest up", "Move slowly for more burn"], emoji: "🌀", forGoals: ["lose_weight", "gain_muscle"] },
  { id: "co4", name: "Leg Raises", category: "calisthenics", muscleGroup: "Core", muscles: ["Lower Abs", "Hip Flexors"], difficulty: "intermediate", equipment: "None or Bench", caloriesPer30: 70, defaultSets: 3, defaultReps: "12-15", description: "Targets the often-neglected lower abs.", steps: ["Lie flat on back, hands at sides", "Keep legs straight, raise to 90°", "Lower slowly without touching floor", "Repeat without momentum"], tips: ["Press lower back into floor", "Bend knees to make easier"], emoji: "🦵", forGoals: ["gain_muscle"] },
  { id: "co5", name: "Mountain Climbers", category: "hiit", muscleGroup: "Core", muscles: ["Core", "Hip Flexors", "Shoulders"], difficulty: "beginner", equipment: "None", caloriesPer30: 200, defaultSets: 4, defaultReps: "30 sec", description: "Dynamic core exercise that doubles as cardio.", steps: ["Start in push-up position", "Drive one knee toward chest", "Switch legs quickly", "Keep hips level throughout"], tips: ["Go faster for more cardio", "Keep arms straight"], emoji: "⛰️", forGoals: ["lose_weight", "maintain"] },
  { id: "co6", name: "Dead Bug", category: "calisthenics", muscleGroup: "Core", muscles: ["Transverse Abdominis", "Rectus Abdominis"], difficulty: "beginner", equipment: "None", caloriesPer30: 50, defaultSets: 3, defaultReps: "10 each side", description: "Anti-extension core exercise for deep stabilizer muscles.", steps: ["Lie on back, arms straight up, knees at 90°", "Lower opposite arm and leg toward floor", "Keep lower back pressed into floor", "Return and switch sides"], tips: ["Move slowly and controlled", "Exhale as you extend"], emoji: "🐛", forGoals: ["maintain", "gain_muscle"] },
  { id: "co7", name: "Bicycle Crunches", category: "calisthenics", muscleGroup: "Core", muscles: ["Obliques", "Rectus Abdominis"], difficulty: "beginner", equipment: "None", caloriesPer30: 80, defaultSets: 3, defaultReps: "20 total", description: "Combines crunches with rotation for complete ab workout.", steps: ["Lie on back, hands behind head", "Bring right elbow to left knee", "Extend right leg straight", "Alternate sides in cycling motion"], tips: ["Don't rush — quality over speed", "Touch elbow to knee each rep"], emoji: "🚲", forGoals: ["lose_weight", "gain_muscle"] },

  // ══════ CARDIO ══════
  { id: "ca1", name: "Running", category: "cardio", muscleGroup: "Full Body", muscles: ["Quads", "Calves", "Hamstrings", "Heart"], difficulty: "beginner", equipment: "None", caloriesPer30: 300, defaultSets: 1, defaultReps: "20-40 min", description: "The most accessible cardio. Run outdoors or on a treadmill.", steps: ["Warm up with 5 min walk", "Build to comfortable pace", "Maintain steady breathing", "Cool down with 5 min walk"], tips: ["Land mid-foot, not heel", "Start slow, build distance over weeks"], emoji: "🏃", forGoals: ["lose_weight", "maintain"] },
  { id: "ca2", name: "Cycling", category: "cardio", muscleGroup: "Legs", muscles: ["Quads", "Calves", "Heart"], difficulty: "beginner", equipment: "Bike or Stationary", caloriesPer30: 250, defaultSets: 1, defaultReps: "20-45 min", description: "Low-impact cardio that's easy on joints.", steps: ["Adjust seat height properly", "Start pedaling at moderate pace", "Mix in higher resistance intervals", "Cool down with easy spinning"], tips: ["Keep cadence 80-100 RPM", "Great for active recovery days"], emoji: "🚴", forGoals: ["lose_weight", "maintain"] },
  { id: "ca3", name: "Jump Rope", category: "cardio", muscleGroup: "Full Body", muscles: ["Calves", "Shoulders", "Core", "Heart"], difficulty: "intermediate", equipment: "Jump Rope", caloriesPer30: 350, defaultSets: 1, defaultReps: "15-20 min", description: "One of the highest calorie-burning exercises. A boxer's favorite.", steps: ["Hold handles at hip height", "Jump 1-2 inches, land on balls of feet", "Rotate rope with wrists not arms", "Alternate: 1 min on, 30 sec rest"], tips: ["Start with basic bounce", "Use a proper speed rope"], emoji: "⏭️", forGoals: ["lose_weight"] },
  { id: "ca4", name: "Swimming", category: "cardio", muscleGroup: "Full Body", muscles: ["Lats", "Shoulders", "Core", "Legs", "Heart"], difficulty: "intermediate", equipment: "Pool", caloriesPer30: 250, defaultSets: 1, defaultReps: "20-40 min", description: "Full body, zero-impact cardio. Works every muscle group.", steps: ["Warm up with easy laps", "Mix strokes: freestyle, backstroke", "Try interval sets", "Cool down with easy swimming"], tips: ["Focus on breathing rhythm", "Use kickboard for leg days"], emoji: "🏊", forGoals: ["lose_weight", "maintain"] },
  { id: "ca5", name: "Rowing Machine", category: "cardio", muscleGroup: "Full Body", muscles: ["Back", "Legs", "Arms", "Core", "Heart"], difficulty: "beginner", equipment: "Rowing Machine", caloriesPer30: 280, defaultSets: 1, defaultReps: "15-30 min", description: "Full body cardio that builds both strength and endurance.", steps: ["Strap feet in, grab handle", "Drive with legs first, then pull with arms", "Lean back slightly at end of stroke", "Return in reverse order: arms, body, legs"], tips: ["Power comes from legs, not arms", "Keep consistent stroke rate"], emoji: "🚣", forGoals: ["lose_weight", "maintain"] },
  { id: "ca6", name: "Walking (Brisk)", category: "cardio", muscleGroup: "Legs", muscles: ["Quads", "Calves", "Glutes", "Heart"], difficulty: "beginner", equipment: "None", caloriesPer30: 140, defaultSets: 1, defaultReps: "30-60 min", description: "The most underrated exercise. Low-impact, sustainable, effective.", steps: ["Walk at a pace where you can talk but not sing", "Swing arms naturally", "Take long strides", "Maintain upright posture"], tips: ["Aim for 8,000-10,000 steps daily", "Walk after meals for digestion"], emoji: "🚶", forGoals: ["lose_weight", "maintain"] },
  { id: "ca7", name: "Stair Climber", category: "cardio", muscleGroup: "Legs", muscles: ["Quads", "Glutes", "Calves", "Heart"], difficulty: "intermediate", equipment: "Stairs or Machine", caloriesPer30: 300, defaultSets: 1, defaultReps: "15-30 min", description: "Intense lower body cardio that builds legs and burns fat.", steps: ["Step onto machine or find stairs", "Maintain steady pace", "Stand upright — don't lean on handles", "Push through full foot each step"], tips: ["Don't hold handrails tightly", "Skip steps for more glute work"], emoji: "🪜", forGoals: ["lose_weight"] },

  // ══════ HIIT ══════
  { id: "h1", name: "Burpees", category: "hiit", muscleGroup: "Full Body", muscles: ["Chest", "Legs", "Core", "Shoulders"], difficulty: "intermediate", equipment: "None", caloriesPer30: 400, defaultSets: 4, defaultReps: "10-15", description: "The ultimate full-body HIIT exercise. Burns massive calories.", steps: ["Stand tall, then squat down, hands on floor", "Jump feet back to plank", "Do a push-up (optional)", "Jump feet forward, then jump up with arms high"], tips: ["Modify by stepping instead of jumping", "Focus on form over speed"], emoji: "🔥", forGoals: ["lose_weight"] },
  { id: "h2", name: "Jump Squats", category: "hiit", muscleGroup: "Legs", muscles: ["Quads", "Glutes", "Calves"], difficulty: "intermediate", equipment: "None", caloriesPer30: 280, defaultSets: 4, defaultReps: "12-15", description: "Explosive squat variation for power and calorie burn.", steps: ["Squat down to parallel", "Explode up into a jump", "Land softly, immediately go into next squat", "Keep chest up throughout"], tips: ["Land quietly = good form", "Use arms to generate momentum"], emoji: "🦘", forGoals: ["lose_weight", "gain_muscle"] },
  { id: "h3", name: "High Knees", category: "hiit", muscleGroup: "Full Body", muscles: ["Hip Flexors", "Core", "Quads"], difficulty: "beginner", equipment: "None", caloriesPer30: 240, defaultSets: 4, defaultReps: "30 sec", description: "Fast-paced cardio that elevates heart rate quickly.", steps: ["Stand tall", "Drive knees up alternately as fast as possible", "Pump arms like sprinting", "Stay on balls of feet"], tips: ["Aim for waist-height knees", "Keep core tight"], emoji: "🏃", forGoals: ["lose_weight"] },
  { id: "h4", name: "Box Jumps", category: "hiit", muscleGroup: "Legs", muscles: ["Quads", "Glutes", "Calves"], difficulty: "intermediate", equipment: "Box / Platform", caloriesPer30: 250, defaultSets: 4, defaultReps: "8-12", description: "Plyometric exercise for explosive leg power.", steps: ["Stand facing box, feet shoulder-width", "Swing arms and jump onto box", "Land softly with both feet", "Step down (don't jump down)"], tips: ["Start with lower box", "Always step down to protect joints"], emoji: "📦", forGoals: ["gain_muscle", "lose_weight"] },
  { id: "h5", name: "Battle Ropes", category: "hiit", muscleGroup: "Full Body", muscles: ["Shoulders", "Arms", "Core", "Heart"], difficulty: "intermediate", equipment: "Battle Ropes", caloriesPer30: 380, defaultSets: 5, defaultReps: "30 sec on / 30 sec off", description: "Full body conditioning that destroys calories.", steps: ["Hold rope ends, slight squat stance", "Alternate arms making waves in rope", "Keep core engaged", "Vary patterns: waves, slams, circles"], tips: ["Don't death-grip the ropes", "Generate power from hips"], emoji: "🌊", forGoals: ["lose_weight"] },

  // ══════ FLEXIBILITY / RECOVERY ══════
  { id: "f1", name: "Yoga Flow", category: "flexibility", muscleGroup: "Full Body", muscles: ["All muscles", "Joints", "Mind"], difficulty: "beginner", equipment: "Yoga Mat", caloriesPer30: 80, defaultSets: 1, defaultReps: "20-45 min", description: "Flowing movement sequence for flexibility, strength, and mindfulness.", steps: ["Start in mountain pose", "Flow through sun salutations", "Hold warrior poses 30 sec each", "End with 5 min savasana"], tips: ["Focus on breath", "Never force a stretch"], emoji: "🧘‍♀️", forGoals: ["maintain", "lose_weight"] },
  { id: "f2", name: "Static Stretching", category: "flexibility", muscleGroup: "Full Body", muscles: ["All muscles"], difficulty: "beginner", equipment: "None", caloriesPer30: 40, defaultSets: 1, defaultReps: "15-20 min", description: "Hold stretches for 20-30 seconds each. Best after workouts.", steps: ["Target all major muscle groups", "Hold each stretch 20-30 seconds", "Breathe deeply into each stretch", "Never bounce"], tips: ["Stretch after exercise, not before", "Consistency is key for flexibility"], emoji: "🤸", forGoals: ["maintain"] },
  { id: "f3", name: "Foam Rolling", category: "flexibility", muscleGroup: "Full Body", muscles: ["Fascia", "Muscles"], difficulty: "beginner", equipment: "Foam Roller", caloriesPer30: 30, defaultSets: 1, defaultReps: "10-15 min", description: "Self-myofascial release. Reduces soreness and improves recovery.", steps: ["Place roller under target muscle", "Roll slowly over muscle belly", "Pause on tender spots 20-30 sec", "Cover quads, hamstrings, back, IT band"], tips: ["Uncomfortable but shouldn't be painful", "Avoid rolling over joints"], emoji: "🧴", forGoals: ["maintain"] },
];

// ══════════════════════════════════════════════════════════════
// WORKOUT PROGRAMS — Complete training plans
// ══════════════════════════════════════════════════════════════

export interface WorkoutDay {
  day: string;
  name: string;
  exercises: { exerciseId: string; sets: number; reps: string; rest: string }[];
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  duration: string;
  daysPerWeek: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  goal: "lose_weight" | "gain_muscle" | "maintain";
  emoji: string;
  location?: "gym" | "home";
  schedule: WorkoutDay[];
}

export const workoutPrograms: WorkoutProgram[] = [
  {
    id: "p1",
    name: "Full Body Beginner",
    description: "Perfect starting program. 3 days per week, full body each session. Build a foundation of strength.",
    duration: "8 weeks",
    daysPerWeek: 3,
    difficulty: "beginner",
    goal: "gain_muscle",
    emoji: "🌱",
    schedule: [
      { day: "Monday", name: "Full Body A", exercises: [
        { exerciseId: "l1", sets: 3, reps: "12-15", rest: "60s" },
        { exerciseId: "c1", sets: 3, reps: "10-12", rest: "60s" },
        { exerciseId: "b5", sets: 3, reps: "10-12", rest: "60s" },
        { exerciseId: "s2", sets: 3, reps: "12-15", rest: "45s" },
        { exerciseId: "co1", sets: 3, reps: "30 sec", rest: "30s" },
      ]},
      { day: "Wednesday", name: "Full Body B", exercises: [
        { exerciseId: "l3", sets: 3, reps: "10 each", rest: "60s" },
        { exerciseId: "c4", sets: 3, reps: "12-15", rest: "60s" },
        { exerciseId: "b4", sets: 3, reps: "15 sec", rest: "45s" },
        { exerciseId: "a1", sets: 3, reps: "12-15", rest: "45s" },
        { exerciseId: "co7", sets: 3, reps: "20 total", rest: "30s" },
      ]},
      { day: "Friday", name: "Full Body C", exercises: [
        { exerciseId: "l9", sets: 3, reps: "15-20", rest: "45s" },
        { exerciseId: "c1", sets: 3, reps: "max", rest: "60s" },
        { exerciseId: "l8", sets: 3, reps: "30 sec", rest: "45s" },
        { exerciseId: "co5", sets: 3, reps: "30 sec", rest: "30s" },
        { exerciseId: "co2", sets: 3, reps: "20", rest: "30s" },
      ]},
    ],
  },
  {
    id: "p2",
    name: "Push / Pull / Legs",
    description: "The classic bodybuilding split. Each session targets a movement pattern for optimal muscle growth.",
    duration: "12 weeks",
    daysPerWeek: 6,
    difficulty: "intermediate",
    goal: "gain_muscle",
    emoji: "💪",
    schedule: [
      { day: "Mon", name: "Push (Chest, Shoulders, Triceps)", exercises: [
        { exerciseId: "c2", sets: 4, reps: "8-10", rest: "90s" },
        { exerciseId: "s1", sets: 4, reps: "8-12", rest: "90s" },
        { exerciseId: "c3", sets: 3, reps: "10-12", rest: "60s" },
        { exerciseId: "s2", sets: 4, reps: "12-15", rest: "45s" },
        { exerciseId: "a2", sets: 3, reps: "10-15", rest: "60s" },
      ]},
      { day: "Tue", name: "Pull (Back, Biceps)", exercises: [
        { exerciseId: "b1", sets: 4, reps: "6-10", rest: "90s" },
        { exerciseId: "b2", sets: 4, reps: "8-12", rest: "90s" },
        { exerciseId: "b3", sets: 3, reps: "10-12", rest: "60s" },
        { exerciseId: "a1", sets: 3, reps: "10-15", rest: "45s" },
        { exerciseId: "a3", sets: 3, reps: "10-12", rest: "45s" },
      ]},
      { day: "Wed", name: "Legs", exercises: [
        { exerciseId: "l2", sets: 4, reps: "6-10", rest: "120s" },
        { exerciseId: "l4", sets: 3, reps: "10 each", rest: "90s" },
        { exerciseId: "l6", sets: 3, reps: "12-15", rest: "60s" },
        { exerciseId: "l7", sets: 4, reps: "15-20", rest: "45s" },
        { exerciseId: "l9", sets: 3, reps: "15-20", rest: "45s" },
      ]},
      { day: "Thu", name: "Push B", exercises: [
        { exerciseId: "c5", sets: 3, reps: "10-15", rest: "60s" },
        { exerciseId: "s3", sets: 3, reps: "8-12", rest: "60s" },
        { exerciseId: "s2", sets: 4, reps: "15-20", rest: "45s" },
        { exerciseId: "c1", sets: 3, reps: "max", rest: "60s" },
        { exerciseId: "a2", sets: 3, reps: "12-15", rest: "45s" },
      ]},
      { day: "Fri", name: "Pull B", exercises: [
        { exerciseId: "b1", sets: 4, reps: "max", rest: "90s" },
        { exerciseId: "b2", sets: 4, reps: "10-12", rest: "60s" },
        { exerciseId: "a1", sets: 4, reps: "10-12", rest: "45s" },
        { exerciseId: "b4", sets: 3, reps: "20 sec", rest: "30s" },
        { exerciseId: "co4", sets: 3, reps: "12-15", rest: "30s" },
      ]},
      { day: "Sat", name: "Legs B", exercises: [
        { exerciseId: "l5", sets: 4, reps: "5-8", rest: "120s" },
        { exerciseId: "l3", sets: 3, reps: "12 each", rest: "60s" },
        { exerciseId: "l10", sets: 3, reps: "12 each", rest: "60s" },
        { exerciseId: "l7", sets: 4, reps: "20", rest: "45s" },
        { exerciseId: "l8", sets: 3, reps: "45 sec", rest: "30s" },
      ]},
    ],
  },
  {
    id: "p3",
    name: "Fat Burning HIIT",
    description: "High-intensity intervals to maximize calorie burn. Short sessions, maximum results.",
    duration: "6 weeks",
    daysPerWeek: 4,
    difficulty: "intermediate",
    goal: "lose_weight",
    emoji: "🔥",
    schedule: [
      { day: "Mon", name: "HIIT Circuit A", exercises: [
        { exerciseId: "h1", sets: 4, reps: "10", rest: "30s" },
        { exerciseId: "co5", sets: 4, reps: "30 sec", rest: "15s" },
        { exerciseId: "h2", sets: 4, reps: "12", rest: "30s" },
        { exerciseId: "h3", sets: 4, reps: "30 sec", rest: "15s" },
        { exerciseId: "co1", sets: 3, reps: "45 sec", rest: "15s" },
      ]},
      { day: "Tue", name: "Cardio + Core", exercises: [
        { exerciseId: "ca1", sets: 1, reps: "25 min", rest: "—" },
        { exerciseId: "co3", sets: 3, reps: "20 total", rest: "30s" },
        { exerciseId: "co4", sets: 3, reps: "12", rest: "30s" },
        { exerciseId: "co7", sets: 3, reps: "20", rest: "30s" },
      ]},
      { day: "Thu", name: "HIIT Circuit B", exercises: [
        { exerciseId: "h3", sets: 5, reps: "30 sec", rest: "15s" },
        { exerciseId: "l1", sets: 4, reps: "20", rest: "30s" },
        { exerciseId: "c1", sets: 4, reps: "15", rest: "30s" },
        { exerciseId: "h1", sets: 3, reps: "8", rest: "30s" },
        { exerciseId: "co5", sets: 4, reps: "30 sec", rest: "15s" },
      ]},
      { day: "Sat", name: "Active Recovery", exercises: [
        { exerciseId: "ca6", sets: 1, reps: "45 min", rest: "—" },
        { exerciseId: "f1", sets: 1, reps: "20 min", rest: "—" },
        { exerciseId: "f3", sets: 1, reps: "10 min", rest: "—" },
      ]},
    ],
  },
  {
    id: "p4",
    name: "Home Workout (No Equipment)",
    description: "Complete program using only your bodyweight. No gym needed. Perfect for home or travel.",
    duration: "8 weeks",
    daysPerWeek: 4,
    difficulty: "beginner",
    goal: "maintain",
    emoji: "🏠",
    schedule: [
      { day: "Mon", name: "Upper Body", exercises: [
        { exerciseId: "c1", sets: 4, reps: "max", rest: "60s" },
        { exerciseId: "c5", sets: 3, reps: "8-12", rest: "60s" },
        { exerciseId: "s3", sets: 3, reps: "8-12", rest: "60s" },
        { exerciseId: "a2", sets: 3, reps: "10-15", rest: "60s" },
        { exerciseId: "co1", sets: 3, reps: "45 sec", rest: "30s" },
      ]},
      { day: "Tue", name: "Lower Body", exercises: [
        { exerciseId: "l1", sets: 4, reps: "20", rest: "60s" },
        { exerciseId: "l3", sets: 3, reps: "12 each", rest: "60s" },
        { exerciseId: "l9", sets: 3, reps: "20", rest: "45s" },
        { exerciseId: "l8", sets: 3, reps: "45 sec", rest: "45s" },
        { exerciseId: "l7", sets: 3, reps: "20", rest: "30s" },
      ]},
      { day: "Thu", name: "Core + Cardio", exercises: [
        { exerciseId: "co5", sets: 4, reps: "30 sec", rest: "15s" },
        { exerciseId: "co3", sets: 3, reps: "20 total", rest: "30s" },
        { exerciseId: "co7", sets: 3, reps: "20", rest: "30s" },
        { exerciseId: "co6", sets: 3, reps: "10 each", rest: "30s" },
        { exerciseId: "h3", sets: 4, reps: "30 sec", rest: "15s" },
      ]},
      { day: "Sat", name: "Full Body Circuit", exercises: [
        { exerciseId: "h1", sets: 3, reps: "8", rest: "30s" },
        { exerciseId: "l1", sets: 3, reps: "15", rest: "30s" },
        { exerciseId: "c1", sets: 3, reps: "12", rest: "30s" },
        { exerciseId: "l3", sets: 3, reps: "10 each", rest: "30s" },
        { exerciseId: "co1", sets: 3, reps: "30 sec", rest: "20s" },
      ]},
    ],
  },
  {
    id: "p5",
    name: "Strength & Mass Builder",
    description: "Heavy compound movements for maximum strength and muscle gains. 5x5 methodology.",
    duration: "12 weeks",
    daysPerWeek: 4,
    difficulty: "advanced",
    goal: "gain_muscle",
    emoji: "🏋️",
    schedule: [
      { day: "Mon", name: "Heavy Upper", exercises: [
        { exerciseId: "c2", sets: 5, reps: "5", rest: "180s" },
        { exerciseId: "b2", sets: 5, reps: "5", rest: "180s" },
        { exerciseId: "s1", sets: 4, reps: "6-8", rest: "120s" },
        { exerciseId: "a1", sets: 3, reps: "8-10", rest: "60s" },
      ]},
      { day: "Tue", name: "Heavy Lower", exercises: [
        { exerciseId: "l2", sets: 5, reps: "5", rest: "180s" },
        { exerciseId: "l5", sets: 5, reps: "5", rest: "180s" },
        { exerciseId: "l4", sets: 3, reps: "8 each", rest: "90s" },
        { exerciseId: "l7", sets: 4, reps: "12-15", rest: "60s" },
      ]},
      { day: "Thu", name: "Volume Upper", exercises: [
        { exerciseId: "c3", sets: 4, reps: "10-12", rest: "60s" },
        { exerciseId: "b1", sets: 4, reps: "max", rest: "90s" },
        { exerciseId: "s2", sets: 4, reps: "12-15", rest: "45s" },
        { exerciseId: "a2", sets: 3, reps: "10-15", rest: "60s" },
        { exerciseId: "a3", sets: 3, reps: "10-12", rest: "45s" },
      ]},
      { day: "Fri", name: "Volume Lower", exercises: [
        { exerciseId: "l6", sets: 4, reps: "12-15", rest: "60s" },
        { exerciseId: "l3", sets: 3, reps: "12 each", rest: "60s" },
        { exerciseId: "l9", sets: 3, reps: "20", rest: "45s" },
        { exerciseId: "l10", sets: 3, reps: "12 each", rest: "60s" },
        { exerciseId: "co4", sets: 3, reps: "15", rest: "30s" },
      ]},
    ],
  },
  {
    id: "hp1",
    name: "Maison — Full Body Sans Matériel",
    description:
      "Aucun équipement requis. 3 séances/semaine, tout le corps à chaque fois. Idéal si tu débutes ou voyages beaucoup.",
    duration: "6-8 semaines",
    daysPerWeek: 3,
    difficulty: "beginner",
    goal: "gain_muscle",
    emoji: "🏠",
    location: "home",
    schedule: [
      { day: "Jour 1", name: "Corps entier A", exercises: [
        { exerciseId: "l1", sets: 4, reps: "15-20", rest: "45s" },
        { exerciseId: "c1", sets: 4, reps: "10-15", rest: "45s" },
        { exerciseId: "co1", sets: 3, reps: "30-45 sec", rest: "30s" },
        { exerciseId: "l9", sets: 3, reps: "15-20", rest: "30s" },
        { exerciseId: "co5", sets: 3, reps: "30 sec", rest: "30s" },
      ]},
      { day: "Jour 2", name: "Corps entier B", exercises: [
        { exerciseId: "l3", sets: 3, reps: "12 chaque jambe", rest: "45s" },
        { exerciseId: "c5", sets: 3, reps: "8-12", rest: "45s" },
        { exerciseId: "b4", sets: 3, reps: "20 sec", rest: "30s" },
        { exerciseId: "s3", sets: 3, reps: "8-12", rest: "45s" },
        { exerciseId: "co7", sets: 3, reps: "20 total", rest: "30s" },
      ]},
      { day: "Jour 3", name: "Corps entier C", exercises: [
        { exerciseId: "l8", sets: 3, reps: "40-60 sec", rest: "45s" },
        { exerciseId: "c4", sets: 3, reps: "15-20", rest: "45s" },
        { exerciseId: "co4", sets: 3, reps: "12-15", rest: "30s" },
        { exerciseId: "l10", sets: 3, reps: "12 chaque jambe", rest: "45s" },
        { exerciseId: "co6", sets: 3, reps: "10 chaque côté", rest: "30s" },
      ]},
    ],
  },
  {
    id: "hp2",
    name: "Maison — HIIT Brûle-Graisses 20min",
    description:
      "Zéro matériel, 20 minutes, intensité max. Parfait quand tu manques de temps mais veux un vrai effet cardio + calories.",
    duration: "4-6 semaines",
    daysPerWeek: 4,
    difficulty: "intermediate",
    goal: "lose_weight",
    emoji: "🔥",
    location: "home",
    schedule: [
      { day: "Circuit A", name: "HIIT Cardio", exercises: [
        { exerciseId: "h1", sets: 4, reps: "40s effort / 20s repos", rest: "20s" },
        { exerciseId: "co5", sets: 4, reps: "40s effort / 20s repos", rest: "20s" },
        { exerciseId: "l1", sets: 4, reps: "40s effort / 20s repos", rest: "20s" },
        { exerciseId: "c1", sets: 4, reps: "40s effort / 20s repos", rest: "20s" },
      ]},
      { day: "Circuit B", name: "HIIT Full Body", exercises: [
        { exerciseId: "l3", sets: 4, reps: "40s effort / 20s repos", rest: "20s" },
        { exerciseId: "co7", sets: 4, reps: "40s effort / 20s repos", rest: "20s" },
        { exerciseId: "s3", sets: 4, reps: "40s effort / 20s repos", rest: "20s" },
        { exerciseId: "l9", sets: 4, reps: "40s effort / 20s repos", rest: "20s" },
      ]},
    ],
  },
  {
    id: "hp3",
    name: "Maison — Renforcement Doux (Maintien)",
    description:
      "Séances courtes et modérées pour rester actif au quotidien, sans se fatiguer excessivement. Idéal en complément de la marche.",
    duration: "En continu",
    daysPerWeek: 3,
    difficulty: "beginner",
    goal: "maintain",
    emoji: "🧘",
    location: "home",
    schedule: [
      { day: "Jour 1", name: "Tonus léger", exercises: [
        { exerciseId: "l1", sets: 3, reps: "12-15", rest: "45s" },
        { exerciseId: "co1", sets: 3, reps: "20-30 sec", rest: "30s" },
        { exerciseId: "b4", sets: 3, reps: "15 sec", rest: "30s" },
      ]},
      { day: "Jour 2", name: "Mobilité + Core", exercises: [
        { exerciseId: "co6", sets: 3, reps: "10 chaque côté", rest: "30s" },
        { exerciseId: "l9", sets: 3, reps: "15", rest: "30s" },
        { exerciseId: "co2", sets: 3, reps: "15", rest: "30s" },
      ]},
      { day: "Jour 3", name: "Corps entier léger", exercises: [
        { exerciseId: "c4", sets: 3, reps: "10-12", rest: "45s" },
        { exerciseId: "l3", sets: 3, reps: "10 chaque jambe", rest: "45s" },
        { exerciseId: "co1", sets: 3, reps: "20-30 sec", rest: "30s" },
      ]},
    ],
  },
  {
    id: "hp4",
    name: "Maison — Chaise & Mur (Débutant absolu)",
    description:
      "Pour ceux qui reprennent le sport ou n'ont vraiment rien : juste une chaise et un mur. Progressif et rassurant.",
    duration: "4 semaines",
    daysPerWeek: 2,
    difficulty: "beginner",
    goal: "lose_weight",
    emoji: "🪑",
    location: "home",
    schedule: [
      { day: "Séance A", name: "Bas du corps + Core", exercises: [
        { exerciseId: "l8", sets: 3, reps: "20-30 sec", rest: "45s" },
        { exerciseId: "l1", sets: 3, reps: "10-12", rest: "45s" },
        { exerciseId: "co1", sets: 3, reps: "15-20 sec", rest: "30s" },
      ]},
      { day: "Séance B", name: "Haut du corps + Core", exercises: [
        { exerciseId: "c4", sets: 3, reps: "8-10", rest: "45s" },
        { exerciseId: "l9", sets: 3, reps: "12-15", rest: "30s" },
        { exerciseId: "co2", sets: 3, reps: "12-15", rest: "30s" },
      ]},
    ],
  },
];
