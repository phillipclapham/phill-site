/**
 * Conway's Game of Life - Footer Implementation
 *
 * Emergent complexity from simple rules - a perfect metaphor for Protocol Memory.
 *
 * Performance: ~1-2% CPU, pauses when out of viewport
 * Grid: 80x12 (desktop), 40x10 (mobile)
 * Speed: 8 generations/second (meditative, not frantic)
 */

class GameOfLifeFooter {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn('Game of Life canvas not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.running = false;
    this.generationCount = 0;
    this.stagnantGenerations = 0;
    this.lastStateHash = '';
    this.fadeAlpha = 1.0;
    this.isRestarting = false;

    // Timing
    this.fps = 8; // 8 generations per second
    this.frameInterval = 1000 / this.fps;
    this.lastFrameTime = 0;

    // Configuration
    this.cellSize = 8; // Base cell size in pixels
    this.cols = 0;
    this.rows = 0;
    this.grid = [];
    this.nextGrid = [];
    this.colorGrid = []; // Stores color index for each cell

    // Colors (will be updated from CSS variables)
    this.updateColors();

    // Initialize
    this.setupCanvas();
    this.initializeGrid();
    this.seedPattern();
    this.setupIntersectionObserver();
    this.setupResizeHandler();
    this.setupThemeObserver();

    // Start
    this.start();

    // Session 4: Expose for console access
    window.golInstance = this;
  }

  /**
   * Get colors from CSS variables (theme-aware)
   * Uses the same 11-color spectrum as the header neural pulse
   */
  updateColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // 11-color spectrum palette (matches header) - VIBRANT and DISTINGUISHABLE
    if (isDark) {
      // Dark mode: Full saturation spectrum
      this.spectrumColors = [
        'rgba(220, 38, 38, 0.85)',   // Crimson
        'rgba(249, 115, 22, 0.85)',  // Orange
        'rgba(245, 158, 11, 0.85)',  // Gold
        'rgba(132, 204, 22, 0.8)',   // Lime
        'rgba(6, 182, 212, 0.8)',    // Cyan
        'rgba(14, 165, 233, 0.75)',  // Sky
        'rgba(79, 70, 229, 0.75)',   // Indigo
        'rgba(147, 51, 234, 0.7)',   // Purple
        'rgba(236, 72, 153, 0.7)',   // Magenta
        'rgba(244, 114, 182, 0.65)', // Pink
        'rgba(196, 181, 253, 0.6)'   // Lavender
      ];
      this.cellGlow = 3; // More glow in dark mode
    } else {
      // Light mode: Saturated spectrum (clearly distinguishable colors)
      this.spectrumColors = [
        'rgba(220, 38, 38, 0.5)',    // Crimson - RED
        'rgba(249, 115, 22, 0.5)',   // Orange - ORANGE
        'rgba(245, 158, 11, 0.5)',   // Gold - YELLOW
        'rgba(132, 204, 22, 0.45)',  // Lime - GREEN
        'rgba(6, 182, 212, 0.45)',   // Cyan - CYAN
        'rgba(14, 165, 233, 0.45)',  // Sky - BLUE
        'rgba(79, 70, 229, 0.45)',   // Indigo - INDIGO
        'rgba(147, 51, 234, 0.4)',   // Purple - PURPLE
        'rgba(236, 72, 153, 0.4)',   // Magenta - PINK
        'rgba(244, 114, 182, 0.4)',  // Pink - LIGHT PINK
        'rgba(196, 181, 253, 0.35)'  // Lavender - LAVENDER
      ];
      this.cellGlow = 0; // No glow in light mode
    }

    // Session 3B: Founder Mode support
    this.founderModeActive = false;
    this.setupFounderModeListener();
  }

  /**
   * Session 3B: Listen for Founder Mode changes
   */
  setupFounderModeListener() {
    window.addEventListener('founderModeChange', (event) => {
      this.founderModeActive = event.detail.active;
      console.log(`[GameOfLife] Founder Mode ${this.founderModeActive ? 'activated' : 'deactivated'}: cells ${this.founderModeActive ? 'colorful' : 'monochrome'}`);
    });

    // Check if already in Founder Mode
    if (document.documentElement.getAttribute('data-mode') === 'founder') {
      this.founderModeActive = true;
    }
  }

  /**
   * Setup canvas dimensions - fills entire footer
   */
  setupCanvas() {
    const updateSize = () => {
      const container = this.canvas.parentElement;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Responsive grid sizing
      const isMobile = width < 768;
      this.cellSize = isMobile ? 6 : 8;

      // Calculate columns and rows to FILL the entire footer
      this.cols = Math.floor(width / this.cellSize);
      this.rows = Math.floor(height / this.cellSize);

      // Set canvas size to fill footer
      this.canvas.width = width;
      this.canvas.height = height;

      // Update grid if dimensions changed
      if (this.grid.length !== this.rows || this.grid[0]?.length !== this.cols) {
        this.initializeGrid();
        this.seedPattern();
      }
    };

    updateSize();
  }

  /**
   * Initialize empty grid
   */
  initializeGrid() {
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
    this.nextGrid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
    this.colorGrid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
  }

  /**
   * Seed interesting patterns
   */
  seedPattern() {
    this.initializeGrid();

    const patterns = [
      this.seedAcorn.bind(this),
      this.seedRPentomino.bind(this),
      this.seedGliderGun.bind(this),
      this.seedDiehard.bind(this)
    ];

    // Random pattern
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    pattern();

    this.generationCount = 0;
    this.stagnantGenerations = 0;
    this.fadeAlpha = 1.0;
    this.isRestarting = false;
  }

  /**
   * Acorn pattern - evolves for ~5000 generations
   */
  seedAcorn() {
    const centerX = Math.floor(this.cols / 2);
    const centerY = Math.floor(this.rows / 2);

    const pattern = [
      [0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 0, 1, 1, 1]
    ];

    this.placePattern(pattern, centerX - 3, centerY - 1);
  }

  /**
   * R-pentomino - classic methuselah
   */
  seedRPentomino() {
    const centerX = Math.floor(this.cols / 2);
    const centerY = Math.floor(this.rows / 2);

    const pattern = [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0]
    ];

    this.placePattern(pattern, centerX - 1, centerY - 1);
  }

  /**
   * Gosper Glider Gun - produces gliders indefinitely
   */
  seedGliderGun() {
    if (this.cols < 40) {
      // Too small for glider gun, use R-pentomino
      this.seedRPentomino();
      return;
    }

    const startX = 5;
    const startY = Math.floor(this.rows / 2) - 4;

    const pattern = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    this.placePattern(pattern, startX, startY);
  }

  /**
   * Diehard - dies after 130 generations
   */
  seedDiehard() {
    const centerX = Math.floor(this.cols / 2);
    const centerY = Math.floor(this.rows / 2);

    const pattern = [
      [0,0,0,0,0,0,1,0],
      [1,1,0,0,0,0,0,0],
      [0,1,0,0,0,1,1,1]
    ];

    this.placePattern(pattern, centerX - 4, centerY - 1);
  }

  /**
   * Place a pattern on the grid
   */
  placePattern(pattern, startX, startY) {
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[y].length; x++) {
        const gridY = startY + y;
        const gridX = startX + x;

        if (gridY >= 0 && gridY < this.rows && gridX >= 0 && gridX < this.cols) {
          this.grid[gridY][gridX] = pattern[y][x];
          // Assign random spectrum color when cell is born
          if (pattern[y][x]) {
            this.colorGrid[gridY][gridX] = Math.floor(Math.random() * this.spectrumColors.length);
          }
        }
      }
    }
  }

  /**
   * Conway's Game of Life rules
   */
  countNeighbors(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        const nx = (x + dx + this.cols) % this.cols; // Wrap horizontally
        const ny = y + dy;

        if (ny >= 0 && ny < this.rows && this.grid[ny][nx]) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Update grid to next generation
   */
  updateGrid() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const neighbors = this.countNeighbors(x, y);
        const cell = this.grid[y][x];

        // Conway's rules
        if (cell) {
          // Alive cell
          this.nextGrid[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          // Dead cell - if born, assign random color
          const willBeBorn = neighbors === 3;
          this.nextGrid[y][x] = willBeBorn ? 1 : 0;

          if (willBeBorn) {
            // Assign random spectrum color to newly born cell
            this.colorGrid[y][x] = Math.floor(Math.random() * this.spectrumColors.length);
          }
        }
      }
    }

    // Swap grids
    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
    this.generationCount++;
  }

  /**
   * Detect stagnation (static patterns or loops)
   */
  detectStagnation() {
    const hash = this.grid.map(row => row.join('')).join('');

    if (hash === this.lastStateHash) {
      this.stagnantGenerations++;
    } else {
      this.stagnantGenerations = 0;
    }

    this.lastStateHash = hash;

    // Restart after 10 identical generations OR 60 seconds
    return this.stagnantGenerations > 10 || this.generationCount > 480;
  }

  /**
   * Render the grid
   */
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = this.fadeAlpha;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.grid[y][x]) {
          // Session 3B: Use spectrum colors in Founder Mode, monochrome in professional mode
          let cellColor;
          if (this.founderModeActive) {
            // Founder Mode: Colorful spectrum
            const colorIndex = this.colorGrid[y][x];
            cellColor = this.spectrumColors[colorIndex];
          } else {
            // Professional Mode: Monochrome (matches current theme)
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            cellColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(100, 100, 100, 0.5)';
          }

          // Draw alive cell
          this.ctx.fillStyle = cellColor;

          // Add subtle glow in dark mode
          if (this.cellGlow > 0) {
            this.ctx.shadowColor = cellColor;
            this.ctx.shadowBlur = this.cellGlow;
          }

          this.ctx.fillRect(
            x * this.cellSize + 1,
            y * this.cellSize + 1,
            this.cellSize - 2,
            this.cellSize - 2
          );

          this.ctx.shadowBlur = 0;
        }
      }
    }

    this.ctx.globalAlpha = 1.0;
  }

  /**
   * Main animation loop
   */
  animate(timestamp) {
    if (!this.running) return;

    const elapsed = timestamp - this.lastFrameTime;

    if (elapsed > this.frameInterval) {
      this.lastFrameTime = timestamp - (elapsed % this.frameInterval);

      // Handle fade-out restart
      if (this.isRestarting) {
        this.fadeAlpha -= 0.05;
        if (this.fadeAlpha <= 0) {
          this.seedPattern();
          this.fadeAlpha = 0;
          this.isRestarting = false;
        }
      } else if (this.fadeAlpha < 1.0) {
        // Fade in
        this.fadeAlpha = Math.min(1.0, this.fadeAlpha + 0.05);
      } else {
        // Normal update
        this.updateGrid();

        // Check for stagnation
        if (this.detectStagnation()) {
          this.isRestarting = true;
        }
      }

      this.render();
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Start the simulation
   */
  start() {
    this.running = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Stop the simulation
   */
  stop() {
    this.running = false;
  }

  /**
   * Setup Intersection Observer to pause when out of viewport
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!this.running) this.start();
        } else {
          this.stop();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(this.canvas);
  }

  /**
   * Setup resize handler (debounced)
   */
  setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.setupCanvas();
      }, 250);
    });
  }

  /**
   * Watch for theme changes
   */
  setupThemeObserver() {
    const observer = new MutationObserver(() => {
      this.updateColors();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  /* ========================================
     SESSION 4: CONSOLE CONTROL METHODS
     ======================================== */

  /**
   * Toggle pause/play state (for console control)
   */
  togglePause() {
    if (this.running) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Set FPS (speed) of simulation (for console control)
   */
  setFPS(fps) {
    this.fps = fps;
    this.frameInterval = 1000 / this.fps;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new GameOfLifeFooter('life-canvas');
});
