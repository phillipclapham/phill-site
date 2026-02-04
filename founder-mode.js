/**
 * Founder Mode - Visual Toggle System (INVERTED)
 *
 * Default: Founder Mode ON (enhanced state)
 * Toggle: Turns it DOWN to "professional" mode (normie mode)
 *
 * Event-driven architecture for toggling between personal (founder) and professional
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
 * - Subverts expectations: toggle turns things DOWN, not up
 */

/**
 * State Manager
 * Handles mode toggling, persistence, and event dispatching
 * INVERTED: Default to founder mode (enhanced), toggle turns it OFF
 */
class FounderModeState {
  constructor() {
    // INVERTED: Default to TRUE (founder mode ON)
    this._active = true;
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
   * INVERTED: Only turn OFF if explicitly saved as 'false'
   * Default (no saved preference) = founder mode ON
   */
  loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    // INVERTED: Only turn OFF if explicitly saved as false
    if (stored === 'false') {
      this._active = false;
      this.applyMode();
      // Dispatch event asynchronously so listeners are ready
      setTimeout(() => this.dispatchChange(), 0);
    }
    // Default (stored === null or 'true') keeps founder mode ON
    // (already set in constructor and HTML)
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
 * Initialize Founder Mode system on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  // Create state manager
  const founderModeState = new FounderModeState();

  // Create UI toggle
  const founderModeToggle = new FounderModeToggle(founderModeState);

  // Create visual effects
  const founderModeEffects = new FounderModeEffects(founderModeState);

  // Expose to window for console access (debugging + future expansion)
  window.founderMode = {
    state: founderModeState,
    toggle: () => founderModeState.toggle(),
    // Future expansion: content transformation methods will go here
  };

  console.log('🌀 Founder Mode initialized (default: ON - toggle to turn DOWN)');
});
