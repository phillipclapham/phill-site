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
 * - HapticFeedback: Tactile feedback for interactions (Session 5, Feature #8)
 *
 * Design Philosophy:
 * - Discoverable easter egg (no tooltips, subtle icon)
 * - Maintains sophistication in both modes
 * - Event-driven for future content transformation support
 */

/**
 * Haptic Feedback Utility (Session 5, Feature #8)
 * Progressive enhancement - provides tactile feedback on supported devices
 */
class HapticFeedback {
  constructor() {
    this.isSupported = 'vibrate' in navigator;
  }

  /**
   * Trigger haptic feedback
   * @param {number} duration - Duration in milliseconds
   */
  trigger(duration = 20) {
    if (this.isSupported && navigator.vibrate) {
      try {
        navigator.vibrate(duration);
      } catch (e) {
        // Silent fail - haptic feedback is a progressive enhancement
        console.debug('[Haptic] Vibration failed (expected on some devices):', e.message);
      }
    }
  }

  /**
   * Predefined haptic patterns
   */
  patterns = {
    toggle: 30,   // Founder Mode toggle
    click: 20,    // Card clicks
    subtle: 10    // Very subtle interactions
  }
}

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
  constructor(state, haptic = null) {
    this.state = state;
    this.haptic = haptic;
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

    // Haptic feedback (Feature #8 - Session 5)
    if (this.haptic) {
      this.haptic.trigger(this.haptic.patterns.toggle);
    }
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
  constructor(state, haptic = null) {
    this.state = state;
    this.haptic = haptic;
    this.setupClickEffects();
    this.setupCardHaptics();
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
   * Setup haptic feedback for card clicks (Feature #8 - Session 5)
   * Only triggers when Founder Mode is active
   */
  setupCardHaptics() {
    document.addEventListener('click', (e) => {
      // Only trigger haptics if Founder Mode is active
      if (!this.state.active || !this.haptic) return;

      // Check if click target is a card or inside a card
      const card = e.target.closest('.tiltable-card, .state-card, .pm-state-item, .pm-project-item, .pm-expertise-card');

      if (card) {
        this.haptic.trigger(this.haptic.patterns.click);
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

  // Create haptic feedback utility (Feature #8 - Session 5)
  const hapticFeedback = new HapticFeedback();
  if (hapticFeedback.isSupported) {
    console.log('✨ Haptic feedback enabled (Founder Mode only)');
  }

  // Create UI toggle (with haptic feedback)
  const founderModeToggle = new FounderModeToggle(founderModeState, hapticFeedback);

  // Create visual effects (with haptic feedback)
  const founderModeEffects = new FounderModeEffects(founderModeState, hapticFeedback);

  // Expose to window for console access (debugging + future expansion)
  window.founderMode = {
    state: founderModeState,
    toggle: () => founderModeState.toggle(),
    haptic: hapticFeedback,
    // Future expansion: content transformation methods will go here
  };

  console.log('🌀 Founder Mode initialized (hint: check the footer)');
});
