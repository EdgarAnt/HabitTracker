// LeetCode Habit Tracker Widget - External File Version
// Tap widget to update - NEVER need to edit code again!

// ===================================================
// ONE-TIME SETUP (edit these once, then forget about code!)
// ===================================================

// Your habit name
const HABIT_NAME = "Read";

// When you started tracking (NOW WITH NATURAL MONTHS 1-12!)
const START_YEAR = 2025;
const START_MONTH = 7; // July = 7 (natural numbers!)
const START_DAY = 6;

// Total days for your challenge
const TOTAL_DAYS = 100;

// Colors and styling - green/red scheme
const BG_COLOR = "#1a1a1a";
const BG_OVERLAY_OPACITY = 0.8;
const COLOR_COMPLETED = new Color("#00ff88"); // Green - completed days
const COLOR_MISSED = new Color("#ff4444"); // Red - missed past days
const COLOR_FUTURE = new Color("#ffffff", 0.3); // Light grey - future days

// ===================================================
// PROGRESS FILE MANAGEMENT
// ===================================================

const fm = FileManager.local();
// Use script name to create unique file for each widget
const progressFile = fm.joinPath(fm.documentsDirectory(), Script.name() + "_progress.json");

// Convert natural month (1-12) to JavaScript month (0-11)
const START_DATE = new Date(START_YEAR, START_MONTH - 1, START_DAY);

// Load progress from file
function loadProgress() {
if (fm.fileExists(progressFile)) {
try {
const data = fm.readString(progressFile);
return JSON.parse(data);
} catch (e) {
console.log("Error reading progress file, creating new one");
}
}

// Create default progress if file doesn't exist
return {
completedDays: [],
startDate: START_DATE.toISOString(),
totalDays: TOTAL_DAYS,
lastUpdated: new Date().toISOString()
};
}

// Save progress to file
function saveProgress(progress) {
try {
progress.lastUpdated = new Date().toISOString();
const data = JSON.stringify(progress, null, 2);
fm.writeString(progressFile, data);
return true;
} catch (e) {
console.log("Error saving progress: " + e.message);
return false;
}
}

// ===================================================
// CALCULATIONS
// ===================================================

const progress = loadProgress();
const completedDays = progress.completedDays || [];

const NOW = new Date();
const MS_PER_DAY = 86400000;

// Fix: Use date-only comparison to avoid time issues
const todayDate = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate());
const startDate = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());

const DAYS_SINCE_START = Math.round((todayDate - startDate) / MS_PER_DAY);
const CURRENT_DAY = Math.max(0, DAYS_SINCE_START + 1);

// Calculate streak (consecutive days from the end)
function calculateStreak() {
let streak = 0;
for (let i = CURRENT_DAY; i >= 1; i--) {
if (completedDays.includes(i)) {
streak++;
} else {
break;
}
}
return streak;
}

const CURRENT_STREAK = calculateStreak();

// ===================================================
// WIDGET CREATION
// ===================================================

const widget = new ListWidget();

// Background
const overlay = new LinearGradient();
overlay.locations = [0, 1];
overlay.colors = [
new Color(BG_COLOR, BG_OVERLAY_OPACITY),
new Color(BG_COLOR, BG_OVERLAY_OPACITY)
];
widget.backgroundGradient = overlay;

// Layout settings
const PADDING = 8;
const CIRCLE_SIZE = 6;
const CIRCLE_SPACING = 4;
const TEXT_SPACING = 8;
const DOT_SHIFT_LEFT = 2;
const STREAK_OFFSET = DOT_SHIFT_LEFT - 2;

// Layout calculations
const WIDGET_WIDTH = 320;
const AVAILABLE_WIDTH = WIDGET_WIDTH - (2 * PADDING);
const TOTAL_CIRCLE_WIDTH = CIRCLE_SIZE + CIRCLE_SPACING;
const COLUMNS = Math.floor(AVAILABLE_WIDTH / TOTAL_CIRCLE_WIDTH);
const ROWS = Math.ceil(TOTAL_DAYS / COLUMNS);

widget.setPadding(12, PADDING, 12, PADDING);

// ===================================================
// CREATE DOT GRID
// ===================================================

const gridContainer = widget.addStack();
gridContainer.layoutVertically();

const gridStack = gridContainer.addStack();
gridStack.layoutVertically();
gridStack.spacing = CIRCLE_SPACING;

for (let row = 0; row < ROWS; row++) {
const rowStack = gridStack.addStack();
rowStack.layoutHorizontally();
rowStack.addSpacer(DOT_SHIFT_LEFT);

for (let col = 0; col < COLUMNS; col++) {
const day = row * COLUMNS + col + 1;
if (day > TOTAL_DAYS) continue;

const circle = rowStack.addText("●");
circle.font = Font.systemFont(CIRCLE_SIZE);

// Color based on completion status
if (day <= CURRENT_DAY) {
// Past days - green if completed, red if missed
circle.textColor = completedDays.includes(day) ? COLOR_COMPLETED : COLOR_MISSED;
} else {
// Future days - grey
circle.textColor = COLOR_FUTURE;
}

if (col < COLUMNS - 1) rowStack.addSpacer(CIRCLE_SPACING);
}
}

widget.addSpacer(TEXT_SPACING);

// ===================================================
// FOOTER WITH STATS
// ===================================================

const footer = widget.addStack();
footer.layoutHorizontally();

// Left side: Habit name
const habitStack = footer.addStack();
habitStack.addSpacer(STREAK_OFFSET);
const habitText = habitStack.addText(HABIT_NAME);
habitText.font = new Font("Menlo-Bold", 12);
habitText.textColor = COLOR_COMPLETED;

// Right side: Streak
const statsText = `${CURRENT_STREAK} day streak`;
const textWidth = statsText.length * 7.5;
const availableSpace = WIDGET_WIDTH - (PADDING * 2) - STREAK_OFFSET - (habitText.text.length * 7.5);
const spacerLength = availableSpace - textWidth;

footer.addSpacer(spacerLength);

const statsStack = footer.addStack();
const streakText = statsStack.addText(statsText);
streakText.font = new Font("Menlo", 12);
streakText.textColor = COLOR_FUTURE;

// ===================================================
// TAP TO UPDATE - AUTOMATIC VERSION
// ===================================================

if (config.runsInWidget) {
Script.setWidget(widget);
} else {
// When widget is tapped, toggle today's completion
const today = CURRENT_DAY;
const isCompleted = completedDays.includes(today);

// Only allow updates if we're actually in the challenge period
if (today > 0 && today <= TOTAL_DAYS) {
// Update the progress
let newCompletedDays = [...completedDays];

if (isCompleted) {
// Remove today from completed days
newCompletedDays = newCompletedDays.filter(day => day !== today);
} else {
// Add today to completed days
newCompletedDays.push(today);
newCompletedDays.sort((a, b) => a - b);
}

// Save to file
const newProgress = {
...progress,
completedDays: newCompletedDays
};

const saved = saveProgress(newProgress);

if (saved) {
// Success! No popup needed - just silent update
console.log(`Day ${today} ${isCompleted ? 'removed' : 'added'} successfully!`);
} else {
// Show error only if save failed
const alert = new Alert();
alert.title = "Oops!";
alert.message = "Couldn't save progress. Try again.";
alert.addAction("OK");
await alert.presentAlert();
}
} else {
// Just show preview for future days
await widget.presentMedium();
}
}

Script.complete();