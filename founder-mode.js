/**
 * Founder Mode - Visual Toggle System
 *
 * Event-driven architecture for toggling between professional and personal
 * visual aesthetics. Built for future expansion to include content transformation.
 *
 * Architecture:
 * - FounderModeState: State management + event dispatching + localStorage persistence
 * - FounderModeToggle: UI toggle icon (🌀) integrated into footer
 * - FounderModeEffects: Visual effects (spectrum click orbs)
 *
 * Design Philosophy:
 * - Discoverable easter egg (no tooltips, subtle icon)
 * - Maintains sophistication in both modes
 * - Event-driven for future content transformation support
 */

/**
 * State Manager
 * Handles mode toggling, persistence, and event dispatching
 */
class FounderModeState {
  constructor() {
    this._active = false;
    this.EVENT_NAME = 'founderModeChange';
    this.STORAGE_KEY = 'founder-mode';
    this.loadFromStorage();
  }

  get active() {
    return this._active;
  }

  /**
   * Toggle Founder Mode on/off
   * Dispatches custom event for listeners to react
   */
  toggle() {
    this._active = !this._active;
    this.applyMode();
    this.saveToStorage();
    this.dispatchChange();
  }

  /**
   * Apply mode by setting data-mode attribute on <html>
   * CSS rules use [data-mode="founder"] selector
   */
  applyMode() {
    document.documentElement.setAttribute('data-mode',
      this._active ? 'founder' : 'professional'
    );
  }

  /**
   * Dispatch custom event for future content transformation listeners
   */
  dispatchChange() {
    window.dispatchEvent(new CustomEvent(this.EVENT_NAME, {
      detail: {
        active: this._active,
        timestamp: Date.now()
      }
    }));
  }

  /**
   * Load persisted mode from localStorage
   * Restore on page load for continuity
   */
  loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'true') {
      this._active = true;
      this.applyMode();
      // Dispatch event asynchronously so listeners are ready
      setTimeout(() => this.dispatchChange(), 0);
    }
  }

  /**
   * Persist mode to localStorage
   */
  saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, this._active.toString());
  }
}

/**
 * Toggle UI
 * Creates and manages the 🌀 icon in footer
 */
class FounderModeToggle {
  constructor(state) {
    this.state = state;
    this.icon = null;
    this.createToggleIcon();
  }

  /**
   * Create toggle icon and add to footer
   * Subtle, discoverable easter egg aesthetic
   */
  createToggleIcon() {
    const icon = document.createElement('button');
    icon.className = 'founder-mode-toggle';
    icon.setAttribute('aria-label', 'Toggle Founder Mode');
    icon.setAttribute('type', 'button');
    icon.textContent = '🌀';

    icon.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering click orbs
      this.handleToggle();
    });

    // Add to footer (top-right corner)
    const footer = document.querySelector('footer');
    if (footer) {
      // Ensure footer has relative positioning for absolute child
      if (getComputedStyle(footer).position === 'static') {
        footer.style.position = 'relative';
      }
      footer.appendChild(icon);
    } else {
      // Fallback: add to body with fixed positioning
      document.body.appendChild(icon);
    }

    this.icon = icon;
    this.updateIconState();
  }

  /**
   * Handle toggle click
   */
  handleToggle() {
    this.state.toggle();
    this.updateIconState();
    this.playToggleAnimation();
  }

  /**
   * Update icon visual state based on mode
   */
  updateIconState() {
    if (this.state.active) {
      this.icon.classList.add('active');
    } else {
      this.icon.classList.remove('active');
    }
  }

  /**
   * Play spin animation on toggle
   */
  playToggleAnimation() {
    // Reset animation to trigger on every click
    this.icon.style.animation = 'none';
    // Force reflow to restart animation
    void this.icon.offsetWidth;
    this.icon.style.animation = 'founder-toggle-spin 500ms ease-out';
  }
}

/**
 * Visual Effects
 * Spectrum click orbs (active only in Founder Mode)
 */
class FounderModeEffects {
  constructor(state) {
    this.state = state;
    this.setupClickEffects();
  }

  /**
   * Setup global click listener for spectrum orbs
   * Only creates orbs when Founder Mode is active AND in dark mode
   */
  setupClickEffects() {
    document.addEventListener('click', (e) => {
      // Only create orbs if Founder Mode is active AND in dark mode
      // Light mode uses water ripples only (user preference)
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
      if (this.state.active && isDarkMode) {
        this.createSpectrumOrb(e.clientX, e.clientY);
      }
    });
  }

  /**
   * Create expanding spectrum orbs at click position
   * 2 overlapping orbs for visual richness
   */
  createSpectrumOrb(x, y) {
    for (let i = 0; i < 2; i++) {
      const orb = document.createElement('div');
      orb.className = 'founder-click-orb';
      orb.style.left = `${x}px`;
      orb.style.top = `${y}px`;
      orb.style.animationDelay = `${i * 60}ms`;
      document.body.appendChild(orb);

      // Clean up after animation completes
      setTimeout(() => orb.remove(), 660 + (i * 60));
    }
  }
}

/**
 * Cursor Trail - Spectrum Particles (Session 3B)
 * Playful particle trail that follows mouse movement
 */
class CursorTrail {
  constructor(state) {
    this.state = state;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.particlePool = [];
    this.isActive = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.animationFrame = null;

    // Spectrum colors (teal → purple → magenta) - Subtle opacity
    this.colors = [
      'rgba(14, 165, 233, 0.4)',   // Cyan
      'rgba(20, 184, 166, 0.4)',   // Teal
      'rgba(147, 51, 234, 0.4)',   // Purple
      'rgba(236, 72, 153, 0.4)'    // Magenta/Pink
    ];

    this.init();
  }

  /**
   * Initialize canvas and particle pool
   */
  init() {
    // Create full-screen canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1'; // Just above background, below all content
    this.canvas.style.display = 'none'; // Hidden by default
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    // Pre-allocate particle pool (object pooling for performance)
    for (let i = 0; i < 100; i++) {
      this.particlePool.push(this.createParticle());
    }

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }, { passive: true });

    // Handle window resize
    window.addEventListener('resize', () => this.resizeCanvas(), { passive: true });

    // Listen for Founder Mode changes
    window.addEventListener('founderModeChange', (event) => {
      if (event.detail.active) {
        this.start();
      } else {
        this.stop();
      }
    });

    // Start if already in Founder Mode
    if (this.state.active) {
      this.start();
    }
  }

  /**
   * Resize canvas to match window
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Create a particle object
   */
  createParticle() {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0,
      size: 0,
      color: '',
      active: false
    };
  }

  /**
   * Spawn a new particle at mouse position
   */
  spawnParticle() {
    // Get particle from pool
    let particle = this.particlePool.find(p => !p.active);
    if (!particle) return; // Pool exhausted

    // Initialize particle
    particle.active = true;
    particle.x = this.mouseX;
    particle.y = this.mouseY;
    particle.vx = (Math.random() - 0.5) * 2;
    particle.vy = Math.random() * 2 + 1; // Slight downward velocity (gravity)
    particle.life = 0;
    particle.maxLife = Math.random() * 400 + 600; // 600-1000ms (slower fade)
    particle.size = Math.random() * 2 + 2; // 2-4px (more subtle)
    particle.color = this.colors[Math.floor(Math.random() * this.colors.length)];

    this.particles.push(particle);
  }

  /**
   * Update all particles
   */
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.life += 16; // ~60fps
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // Gravity

      // Remove dead particles
      if (p.life >= p.maxLife) {
        p.active = false;
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Render all particles
   */
  renderParticles() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw particles
    for (const p of this.particles) {
      const opacity = 1 - (p.life / p.maxLife); // Fade out
      const size = p.size * opacity; // Shrink as fading

      this.ctx.fillStyle = p.color.replace('0.4)', `${opacity * 0.4})`);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isActive) return;

    // Spawn new particles (1-2 per frame for subtlety)
    const spawnCount = Math.random() > 0.6 ? 2 : 1;
    for (let i = 0; i < spawnCount; i++) {
      this.spawnParticle();
    }

    this.updateParticles();
    this.renderParticles();

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Start cursor trail
   */
  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.canvas.style.display = 'block';
    this.animate();
    console.log('[CursorTrail] Started');
  }

  /**
   * Stop cursor trail
   */
  stop() {
    if (!this.isActive) return;
    this.isActive = false;
    this.canvas.style.display = 'none';
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    // Clear all particles
    this.particles.forEach(p => p.active = false);
    this.particles = [];
    console.log('[CursorTrail] Stopped');
  }
}

/**
 * Initialize Founder Mode system on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  // Create state manager
  const founderModeState = new FounderModeState();

  // Create UI toggle
  const founderModeToggle = new FounderModeToggle(founderModeState);

  // Create visual effects
  const founderModeEffects = new FounderModeEffects(founderModeState);

  // Create cursor trail (Session 3B)
  const cursorTrail = new CursorTrail(founderModeState);

  // Expose to window for console access (debugging + future expansion)
  window.founderMode = {
    state: founderModeState,
    toggle: () => founderModeState.toggle(),
    // Future expansion: content transformation methods will go here
  };

  console.log('🌀 Founder Mode initialized (hint: check the footer)');
});
