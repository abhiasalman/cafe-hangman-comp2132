/**
 * COMP2132 Hangman Game
 * A cafe-themed hangman game implementation
 */

// Game Configuration
const MAX_INCORRECT_GUESSES = 6;
const WORDS_JSON_PATH = './data/words.json';
const CAFE_UPGRADES = [
  { icon: '🪴', name: 'a leafy plant' },
  { icon: '☕', name: 'an espresso cup' },
  { icon: '🧁', name: 'a cupcake display' },
  { icon: '🪑', name: 'a cozy chair' },
  { icon: '🥐', name: 'a pastry basket' },
  { icon: '💡', name: 'a warm lamp' },
  { icon: '🍰', name: 'a cake stand' },
  { icon: '🌷', name: 'fresh flowers' },
  { icon: '🫖', name: 'a tea set' },
  { icon: '📚', name: 'a tiny bookshelf' },
  { icon: '🍪', name: 'a cookie jar' },
  { icon: '🖼️', name: 'some wall art' },
  { icon: '🥪', name: 'a sandwich special' },
  { icon: '🎵', name: 'cafe music' },
  { icon: '🕯️', name: 'a table candle' },
  { icon: '🍩', name: 'a donut tray' },
  { icon: '🧋', name: 'a chilled drink' },
  { icon: '✨', name: 'twinkle lights' }
];

/**
 * Game Object - Manages game state and logic
 */
const Game = {
  words: [],
  currentWord: null,
  currentHint: null,
  guessedLetters: [],
  incorrectGuesses: 0,
  gameOver: false,
  won: false,
  cafeUpgrades: 0,
  menuItems: [],
  missedItems: [],
  previousWord: null,

  /**
   * Initialize the game by loading words from JSON
   */
  init: function() {
    this.loadWords()
      .then(() => this.startNewGame())
      .catch(error => console.error('Failed to load words:', error));
  },

  /**
   * Load words from JSON file using fetch
   */
  loadWords: function() {
    return fetch(WORDS_JSON_PATH)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load words JSON');
        }
        return response.json();
      })
      .then(data => {
        this.words = data.words;
      });
  },

  /**
   * Start a new game with a random word
   */
  startNewGame: function() {
    // Reset game state
    this.guessedLetters = [];
    this.incorrectGuesses = 0;
    this.gameOver = false;
    this.won = false;

    // Select random word
    let selectedItem;
    do {
      const randomIndex = Math.floor(Math.random() * this.words.length);
      selectedItem = this.words[randomIndex];
    } while (this.words.length > 1 && selectedItem.word === this.previousWord);

    this.currentWord = selectedItem.word.toUpperCase();
    this.currentHint = selectedItem.hint;
    this.previousWord = selectedItem.word;

    // Update UI
    this.updateDisplay();
    UI.hideGameOverModal();
    UI.enableGuessInput();
    this.updateCafeRisk();
    UI.updateGameMessage('Every correct letter adds something new to your cafe. Start guessing!');
    UI.updateCafe(this.cafeUpgrades);
    UI.updateMenu(this.menuItems, this.missedItems);
  },

  /**
   * Update the game display
   */
  updateDisplay: function() {
    UI.updateWordDisplay(this.getDisplayWord());
    UI.updateHint(this.currentHint);
    UI.updateIncorrectCount(this.incorrectGuesses, MAX_INCORRECT_GUESSES);
  },

  /**
   * Get the word display with guessed and unguessed letters
   */
  getDisplayWord: function() {
    return this.currentWord
      .split('')
      .map(letter => this.guessedLetters.includes(letter) ? letter : '_');
  },

  /**
   * Check if the word is completely guessed
   */
  isWordComplete: function() {
    return this.currentWord
      .split('')
      .every(letter => this.guessedLetters.includes(letter));
  },

  /**
   * Make a guess with a letter
   */
  guessLetter: function(letter) {
    const normalizedLetter = letter.trim().toUpperCase();

    if (!/^[A-Z]$/.test(normalizedLetter)) {
      UI.showInputError('Please enter one letter from A to Z.');
      return;
    }

    if (this.gameOver) {
      return;
    }

    if (this.guessedLetters.includes(normalizedLetter)) {
      UI.showInputError(`You already guessed ${normalizedLetter}. Try a different letter.`);
      return;
    }

    UI.clearInputError();

    // Add letter to guessed letters
    this.guessedLetters.push(normalizedLetter);

    // Check if letter is in word
    if (!this.currentWord.includes(normalizedLetter)) {
      this.incorrectGuesses++;
      UI.updateGameMessage(`No ${normalizedLetter} this time. Keep going — your cafe still has room to grow!`, 'wrong');
    } else {
      this.cafeUpgrades++;
      const upgrade = CAFE_UPGRADES[(this.cafeUpgrades - 1) % CAFE_UPGRADES.length];
      UI.updateCafe(this.cafeUpgrades, upgrade);
      UI.updateGameMessage(`Great guess! You added ${upgrade.name} to the cafe.`, 'correct');
    }

    // Update display
    this.updateDisplay();
    this.updateCafeRisk();

    // Check win/loss conditions
    this.checkGameStatus();
  },

  /**
   * Check if game is won or lost
   */
  checkGameStatus: function() {
    if (this.isWordComplete()) {
      this.endGame(true);
    } else if (this.incorrectGuesses >= MAX_INCORRECT_GUESSES) {
      this.endGame(false);
    }
  },

  /**
   * End the game
   */
  endGame: function(won) {
    this.gameOver = true;
    this.won = won;
    UI.disableGuessInput();
    const itemName = this.toTitleCase(this.currentWord);

    if (won) {
      if (!this.menuItems.includes(itemName)) {
        this.menuItems.push(itemName);
      }
      UI.updateGameMessage(`${itemName} is now a cafe special. Your menu is growing!`, 'correct');
    } else {
      if (!this.missedItems.includes(itemName)) {
        this.missedItems.push(itemName);
      }
      UI.updateGameMessage(`Oh no! Your cafe will not have ${itemName} this time because that chance was lost.`, 'wrong');
    }

    UI.updateMenu(this.menuItems, this.missedItems);
    UI.showGameOverModal(won, this.currentWord);
  },

  toTitleCase: function(word) {
    return word.charAt(0) + word.slice(1).toLowerCase();
  },

  /**
   * Tint the cafe scene as the player gets closer to losing
   */
  updateCafeRisk: function() {
    const riskLevel = Math.min(this.incorrectGuesses, MAX_INCORRECT_GUESSES);
    UI.updateCafeRisk(riskLevel);
  }
};

/**
 * UI Object - Manages all UI updates
 */
const UI = {
  wordDisplay: null,
  hintDisplay: null,
  incorrectCountDisplay: null,
  cafeItems: null,
  cafeLevel: null,
  upgradePop: null,
  upgradeCount: null,
  gameMessage: null,
  menuItems: null,
  missedItems: null,
  guessForm: null,
  letterInput: null,
  guessButton: null,
  inputError: null,
  hangmanImage: null,
  gameOverModal: null,
  playAgainBtn: null,

  /**
   * Initialize UI elements
   */
  init: function() {
    this.wordDisplay = document.getElementById('word-display');
    this.hintDisplay = document.getElementById('hint-text');
    this.incorrectCountDisplay = document.getElementById('incorrect-count');
    this.cafeItems = document.getElementById('cafe-items');
    this.cafeLevel = document.getElementById('cafe-level');
    this.upgradePop = document.getElementById('upgrade-pop');
    this.upgradeCount = document.getElementById('upgrade-count');
    this.gameMessage = document.getElementById('game-message');
    this.menuItems = document.getElementById('menu-items');
    this.missedItems = document.getElementById('missed-items');
    this.guessForm = document.getElementById('guess-form');
    this.letterInput = document.getElementById('letter-input');
    this.guessButton = document.getElementById('guess-btn');
    this.inputError = document.getElementById('input-error');
    this.hangmanImage = document.getElementById('hangman-image');
    this.gameOverModal = document.getElementById('game-over-modal');
    this.playAgainBtn = document.getElementById('play-again-btn');

    // Event listeners
    this.playAgainBtn.addEventListener('click', () => Game.startNewGame());
    this.guessForm.addEventListener('submit', event => {
      event.preventDefault();
      Game.guessLetter(this.letterInput.value);
      this.letterInput.value = '';

      if (!Game.gameOver) {
        this.letterInput.focus();
      }
    });

    this.letterInput.addEventListener('input', () => {
      this.letterInput.value = this.letterInput.value.replace(/[^a-z]/gi, '').toUpperCase();
      this.clearInputError();
    });
  },

  /**
   * Update word display
   */
  updateWordDisplay: function(letters) {
    this.wordDisplay.innerHTML = '';
    this.wordDisplay.dataset.length = letters.length;

    letters.forEach(letter => {
      const tile = document.createElement('span');
      tile.className = `letter-slot${letter === '_' ? '' : ' revealed'}`;
      tile.textContent = letter;
      this.wordDisplay.appendChild(tile);
    });

    this.wordDisplay.setAttribute(
      'aria-label',
      letters.map(letter => letter === '_' ? 'blank' : letter).join(', ')
    );
    this.wordDisplay.classList.remove('fade-in');
    // Trigger reflow to restart animation
    void this.wordDisplay.offsetWidth;
    this.wordDisplay.classList.add('fade-in');
  },

  /**
   * Update hint display
   */
  updateHint: function(hint) {
    this.hintDisplay.textContent = hint;
  },

  /**
   * Update incorrect guess count
   */
  updateIncorrectCount: function(incorrect, total) {
    this.incorrectCountDisplay.textContent = `${incorrect} / ${total}`;
  },

  showInputError: function(message) {
    this.inputError.textContent = message;
    this.letterInput.classList.add('has-error');
  },

  clearInputError: function() {
    this.inputError.textContent = '';
    this.letterInput.classList.remove('has-error');
  },

  updateGameMessage: function(message, type) {
    this.gameMessage.textContent = message;
    this.gameMessage.className = `game-message${type ? ` ${type}` : ''}`;
  },

  updateCafe: function(totalUpgrades, newestUpgrade) {
    this.cafeItems.innerHTML = '';
    const visibleCount = Math.min(totalUpgrades, CAFE_UPGRADES.length);

    for (let index = 0; index < visibleCount; index++) {
      const item = document.createElement('span');
      item.className = `cafe-item cafe-item-${index + 1}`;
      item.textContent = CAFE_UPGRADES[index].icon;
      item.title = CAFE_UPGRADES[index].name;
      this.cafeItems.appendChild(item);
    }

    let level = 'Tiny cafe';
    if (totalUpgrades >= 5) level = 'Cozy corner';
    if (totalUpgrades >= 10) level = 'Busy bistro';
    if (totalUpgrades >= 18) level = 'Dream cafe';

    this.cafeLevel.textContent = `${level} • ${totalUpgrades} upgrade${totalUpgrades === 1 ? '' : 's'}`;
    this.upgradeCount.textContent = `${totalUpgrades} item${totalUpgrades === 1 ? '' : 's'} added`;
    document.getElementById('cafe-builder').classList.toggle('is-bustling', totalUpgrades >= 10);

    if (newestUpgrade) {
      this.upgradePop.textContent = `+ ${newestUpgrade.icon}`;
      this.upgradePop.classList.remove('show');
      void this.upgradePop.offsetWidth;
      this.upgradePop.classList.add('show');
    }
  },

  updateMenu: function(menuItems, missedItems) {
    this.menuItems.innerHTML = menuItems.length
      ? menuItems.map(item => `<span>${item}</span>`).join('')
      : 'Win a round to add your first special!';

    this.missedItems.textContent = missedItems.length
      ? `Missed chances: ${missedItems.join(', ')}`
      : '';
  },

  enableGuessInput: function() {
    this.letterInput.disabled = false;
    this.guessButton.disabled = false;
    this.letterInput.value = '';
    this.clearInputError();
    this.letterInput.focus();
  },

  disableGuessInput: function() {
    this.letterInput.disabled = true;
    this.guessButton.disabled = true;
  },

  /**
   * Update the cafe's visual danger level
   */
  updateCafeRisk: function(stage) {
    document.getElementById('cafe-builder').style.setProperty('--danger-level', stage);
    this.hangmanImage.src = `./images/hangman-${stage}.svg`;
    this.hangmanImage.alt = `Hangman stage ${stage} of ${MAX_INCORRECT_GUESSES}`;
  },

  /**
   * Show game over modal
   */
  showGameOverModal: function(won, word) {
    const title = this.gameOverModal.querySelector('h2');
    const resultWord = document.getElementById('result-word');
    const resultMessage = this.gameOverModal.querySelector('.result-message');

    if (won) {
      this.gameOverModal.classList.remove('lose');
      this.gameOverModal.classList.add('win');
      title.textContent = '☕ YOU WON! ☕';
      resultMessage.textContent = 'Great job! You guessed the word correctly!';
      document.getElementById('result-cafe-message').textContent =
        `${Game.toTitleCase(word)} has been added to your cafe menu!`;
    } else {
      this.gameOverModal.classList.remove('win');
      this.gameOverModal.classList.add('lose');
      title.textContent = '😢 YOU LOST! 😢';
      resultMessage.textContent = 'Better luck next time!';
      document.getElementById('result-cafe-message').textContent =
        `Your cafe will not have ${Game.toTitleCase(word)} this time — you lost that menu chance.`;
    }

    resultWord.textContent = word;
    this.gameOverModal.classList.add('show');
  },

  /**
   * Hide game over modal
   */
  hideGameOverModal: function() {
    this.gameOverModal.classList.remove('show');
  }
};

/**
 * Initialize game when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  Game.init();
});
