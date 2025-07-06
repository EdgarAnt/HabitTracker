# Habit Tracker Widget
A minimalist iOS widget built with Scriptable to track your daily LeetCode practice streak.

---

## Overview
This widget helps you maintain consistency in your coding practice by providing a visual representation of your progress.  
Originally created to track LeetCode problems, but can be adapted for any daily habit.

---

## Features
- Visual progress tracking with color-coded dots  
  - 🟩 **Green:** Completed days  
  - 🟥 **Red:** Missed days  
  - ⬜ **Gray:** Future days
- Current streak counter
- Tap to toggle today's completion status
- Automatic progress saving
- Clean, minimal design
- Generates a JSON file to store completed/missed days
- Set once and forget — no need to edit code after initial setup

---

## Installation
1. Download **Scriptable** from the App Store  
2. Create a new script and paste the code  
3. Edit these three variables at the top of the file:

   ```javascript
   const HABIT_NAME = "LeetCode";
   const START_DATE = new Date(2025, 5, 18); // May 18, 2025
   const TOTAL_DAYS = 100;
   ```

4. Run the script once to test

5. Add a Scriptable widget to your home screen

6. Long press the widget and select this script

## Usage

Simply tap the widget to mark today as complete.  
Tap again to unmark if needed.  
The widget automatically calculates your current streak and updates the visual grid.

---

## Customization

You can modify the color scheme by editing these constants:

```javascript
const COLOR_COMPLETED = new Color("#00ff88");   // Green  
const COLOR_MISSED = new Color("#ff4444");      // Red  
const COLOR_FUTURE = new Color("#ffffff", 0.3); // Light gray
```

## Technical Details

- Progress data is stored locally in your device's documents directory  
- Each widget instance maintains its own progress file  
- The widget updates immediately when tapped  
- Supports up to **100-day challenges** by default


