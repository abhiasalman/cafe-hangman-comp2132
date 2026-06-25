# ☕ Cafe Hangman Game

A beautiful, responsive hangman game with a cafe theme built with vanilla JavaScript, HTML, SCSS, and SVG.

## Project Overview

This is a COMP2132 project implementing a modern hangman game where players guess letters to find cafe-related words before running out of chances.

## Features

- **Cafe Theme Design**: Warm, inviting color palette with coffee and pastry themed styling
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Random Word Selection**: Dynamically selects from a collection of 79 cafe drinks, desserts, pastries, and savory foods
- **Helpful Hints**: Each word includes a descriptive hint to guide players
- **Input-Based Guessing**: Players enter one letter at a time in the required input field
- **Optional Letter Buttons**: On-screen A–Z controls provide a second convenient way to guess
- **Visual Hangman Progression**: Shows hangman figure as incorrect guesses accumulate
- **Smooth Animations**: Fade-in effects on word updates and slide-in modal
- **Disabled Letters**: Prevents duplicate letter guesses
- **Game Over Modal**: Displays results with the correct word and play again option
- **Cafe Builder**: Every correct letter adds a new animated item to the player's cafe
- **Growing Menu**: Won words become cafe specials, while missed items are recorded as lost chances

## Project Structure

```
Project1/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Compiled CSS from SCSS
├── scss/
│   └── styles.scss     # SASS file with mixins and variables
├── js/
│   └── game.js         # Game logic and UI management
├── data/
│   └── words.json      # Word and hint data
├── images/
│   ├── hangman-0.svg   # Start stage
│   ├── hangman-1.svg   # 1 incorrect guess
│   ├── hangman-2.svg   # 2 incorrect guesses
│   ├── hangman-3.svg   # 3 incorrect guesses
│   ├── hangman-4.svg   # 4 incorrect guesses
│   ├── hangman-5.svg   # 5 incorrect guesses
│   ├── hangman-6.svg   # 6 incorrect guesses (game over)
│   ├── coffee-cup.svg  # Decorative image
│   ├── donut.svg       # Decorative image
│   ├── croissant.svg   # Decorative image
│   ├── cappuccino.svg  # Decorative image
│   └── cafe-scene.svg  # Decorative image
└── README.md           # This file
```

## Technical Implementation

### HTML (`index.html`)
- Semantic structure with proper sections
- Script tags in head with defer attribute for performance
- Proper meta viewport for responsive design

### CSS/SCSS (`css/styles.css` and `scss/styles.scss`)
- **SCSS Mixins**: `@mixin interactive-element` and `@mixin letter-button` for reusable styles
- **Color Variables**: Cafe-themed palette (warm browns, soft pinks, creams)
- **Responsive Design**: Media queries for tablets (768px) and mobile (480px)
- **Animations**: Fade-in and slide-in effects for enhanced UX
- **Grid Layout**: Modern CSS Grid for content arrangement

### JavaScript (`js/game.js`)

#### Game Object
Manages all game logic and state:
- `init()` - Initializes game and loads words
- `loadWords()` - Fetches words from JSON via HTTP
- `startNewGame()` - Resets and starts a new game
- `guessLetter(letter)` - Handles letter guessing logic
- `checkGameStatus()` - Checks for win/loss conditions
- `endGame(won)` - Handles game over state
- `updateCafeRisk()` - Updates the hangman stage and cafe danger tint

#### UI Object
Manages all user interface updates:
- `init()` - Initializes UI element references
- `updateWordDisplay(word)` - Updates guessed word display
- `updateHint(hint)` - Updates hint text
- `updateIncorrectCount()` - Updates incorrect guess counter
- `disableLetterOption()` - Disables a guessed letter so it cannot be selected twice
- `updateCafeRisk()` - Loads the correct relative-path hangman image
- `showGameOverModal()` - Displays game over screen
- `hideGameOverModal()` - Hides game over screen

### Data (`data/words.json`)
- 79 varied cafe-related words with hints
- Easy to extend with additional words

## Game Rules

1. **Start**: Game randomly selects a word and displays blank spaces
2. **Guessing**: Enter one letter in the input field and submit it, or use the optional letter buttons
3. **Correct Guess**: Guessed letters appear in their positions
4. **Incorrect Guess**: Hangman figure progresses and incorrect count increases
5. **Disabled Letters**: Once guessed, letters are disabled and visually marked
6. **Win Condition**: Correctly guess all letters in the word
7. **Lose Condition**: Make 6 incorrect guesses
8. **Game Over**: Modal displays result and offers "Play Again" button
9. **Reset**: "Play Again" resets all game state and starts fresh game

## Design Features

- **Cafe Color Palette**:
  - Primary: #d4957a (warm cafe brown)
  - Secondary: #f4d4c5 (light cream)
  - Accent: #e8b4d4 (soft pink)
  - Dark: #5a3a32 (dark brown text)

- **Visual Elements**:
  - Rounded corners on buttons and containers
  - Box shadows for depth
  - Smooth transitions on interactive elements
  - Gradient backgrounds for visual interest

- **Typography**:
  - Georgia serif for headings (elegant)
  - Segoe UI sans-serif for body text (readable)
  - Monospace font for word display (clarity)

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Works on all modern mobile browsers

## How to Run

Because the word list is loaded with `fetch()`, serve the project over HTTP:

1. Open a terminal in the project folder
2. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
3. Visit `http://localhost:8000`

## Custom JavaScript Implementation

The project includes:
- **Custom Objects**: `Game` and `UI` objects for organized code
- **Custom Functions**: 15+ functions for game logic and UI management
- **Fetch API**: Loads words from JSON file via HTTP request
- **DOM Manipulation**: Dynamically creates and updates all UI elements
- **Event Listeners**: Form submission, input validation, letter button, and play-again handlers

## Animations

1. **Fade-in**: Word display fades in when updated (0.5s)
2. **Slide-in**: Game over modal slides in from top (0.4s)
3. **Button Hover**: Buttons translate up slightly with enhanced shadow
4. **Button Click**: Buttons depress on click for tactile feedback

## SCSS Features

### Variables
- Color variables for easy theme customization
- Font variables for typography consistency
- Spacing unit variables for scalable layouts

### Mixins
- `@mixin interactive-element` - Reusable button/element styling with hover and active states
- `@mixin letter-button` - Specialized styling for letter buttons with disabled state

### Responsive
- Mobile-first approach with media queries
- Breakpoints at 768px (tablet) and 480px (mobile)
- Flexible grid layouts for content

## Future Enhancements

- Difficulty levels (easy, medium, hard)
- Multiplayer mode
- Sound effects
- Score tracking
- Local storage for high scores
- Dark mode toggle
- Additional word categories

## Credits

Built for COMP2132 Project Assignment at BCIT

## License

Educational project - Feel free to use and modify for learning purposes.
