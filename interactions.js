/**
 * Interactions.js - Session 1: Foundation + Hover Effects
 *
 * Handles:
 * - Neural pulse hover glow (distance-based intensity)
 * - Link underline spectrum gradient animations
 * - Performance-optimized event handling
 *
 * Design Philosophy: "Make the quiet parts louder, not the loud parts deafening"
 * Chrome Performance: Keep animated layer count LOW, use CSS custom properties
 */

(function() {
  'use strict';

  /* ========================================
     CONFIGURATION
     ======================================== */

  const CONFIG = {
    // Neural Pulse Glow
    glowMaxDistance: 500,      // Maximum distance (px) for glow effect
    glowMinDistance: 0,         // Minimum distance for full glow
    glowUpdateThrottle: 16,     // Throttle mousemove to 60fps (16ms)

    // Performance
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };

  /* ========================================
     PERFORMANCE UTILITIES
     ======================================== */

  /**
   * Throttle function - Limits function execution to once per interval
   * @param {Function} func - Function to throttle
   * @param {Number} wait - Milliseconds to wait between executions
   * @returns {Function} - Throttled function
   */
  function throttle(func, wait) {
    let timeout = null;
    let previous = 0;

    return function(...args) {
      const now = Date.now();
      const remaining = wait - (now - previous);

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func.apply(this, args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          previous = Date.now();
          timeout = null;
          func.apply(this, args);
        }, remaining);
      }
    };
  }

  /**
   * Request Animation Frame wrapper with fallback
   */
  const requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           function(callback) { window.setTimeout(callback, 1000 / 60); };
  })();

  /* ========================================
     NEURAL PULSE HOVER GLOW
     ======================================== */

  class NeuralPulseGlow {
    constructor() {
      this.pulseElement = document.querySelector('.cognitive-pulse');
      this.pulseCenter = { x: 0, y: 0 };
      this.currentIntensity = 0;
      this.targetIntensity = 0;
      this.isAnimating = false;

      // Skip initialization on mobile or if reduced motion preferred
      if (CONFIG.isMobile || CONFIG.prefersReducedMotion || !this.pulseElement) {
        return;
      }

      this.init();
    }

    /**
     * Initialize the glow system
     */
    init() {
      this.calculatePulseCenter();
      this.attachEventListeners();

      // Recalculate center on window resize
      window.addEventListener('resize', throttle(() => {
        this.calculatePulseCenter();
      }, 250));
    }

    /**
     * Calculate the center point of the neural pulse
     */
    calculatePulseCenter() {
      if (!this.pulseElement) return;

      const rect = this.pulseElement.getBoundingClientRect();
      this.pulseCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }

    /**
     * Attach mousemove listener (throttled for performance)
     */
    attachEventListeners() {
      const throttledMouseMove = throttle((e) => {
        this.handleMouseMove(e);
      }, CONFIG.glowUpdateThrottle);

      document.addEventListener('mousemove', throttledMouseMove, { passive: true });
    }

    /**
     * Handle mouse movement and update glow intensity
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseMove(e) {
      // Calculate distance from mouse to pulse center
      const distance = Math.sqrt(
        Math.pow(e.clientX - this.pulseCenter.x, 2) +
        Math.pow(e.clientY - this.pulseCenter.y, 2)
      );

      // Calculate intensity (1.0 at center, 0.0 at maxDistance)
      // Uses inverse square falloff for natural feel
      let intensity = 0;
      if (distance < CONFIG.glowMaxDistance) {
        // Linear falloff: 1.0 at min distance, 0.0 at max distance
        intensity = 1 - (distance / CONFIG.glowMaxDistance);

        // Apply easing for smoother falloff (ease-out cubic)
        intensity = 1 - Math.pow(1 - intensity, 3);
      }

      this.targetIntensity = intensity;

      // Start smooth animation if not already running
      if (!this.isAnimating) {
        this.animateGlow();
      }
    }

    /**
     * Smoothly animate glow intensity using requestAnimationFrame
     */
    animateGlow() {
      this.isAnimating = true;

      const animate = () => {
        // Smooth interpolation (lerp) towards target intensity
        const diff = this.targetIntensity - this.currentIntensity;

        if (Math.abs(diff) > 0.001) {
          this.currentIntensity += diff * 0.15; // Lerp factor (0.15 = smooth)
          this.updateGlowCSS();
          requestAnimFrame(animate);
        } else {
          this.currentIntensity = this.targetIntensity;
          this.updateGlowCSS();
          this.isAnimating = false;
        }
      };

      animate();
    }

    /**
     * Update CSS custom property for glow intensity
     */
    updateGlowCSS() {
      document.documentElement.style.setProperty('--glow-intensity', this.currentIntensity.toFixed(3));
    }
  }

  /* ========================================
     LINK UNDERLINE SPECTRUM ANIMATIONS
     ======================================== */

  class LinkUnderlineAnimations {
    constructor() {
      this.navLinks = document.querySelectorAll('.nav-links a, .social-links a');

      // Skip on mobile or if reduced motion preferred
      if (CONFIG.isMobile || CONFIG.prefersReducedMotion) {
        return;
      }

      this.init();
    }

    /**
     * Initialize link animations
     */
    init() {
      // Note: Spectrum gradient underline is handled via CSS
      // This class is a placeholder for future enhancements (e.g., dynamic gradients)

      // Add spectrum-underline class to all links for CSS targeting
      this.navLinks.forEach(link => {
        link.classList.add('spectrum-underline');
      });
    }
  }

  /* ========================================
     INITIALIZATION
     ======================================== */

  /**
   * Initialize all interactions when DOM is ready
   */
  function initInteractions() {
    // Check if we should skip interactions (mobile, reduced motion)
    if (CONFIG.prefersReducedMotion) {
      console.log('[Interactions] Reduced motion preference detected - skipping animations');
      return;
    }

    if (CONFIG.isMobile) {
      console.log('[Interactions] Mobile device detected - skipping hover effects');
      return;
    }

    // Initialize Neural Pulse Glow
    const neuralGlow = new NeuralPulseGlow();
    console.log('[Interactions] Neural pulse glow initialized');

    // Initialize Link Underline Animations
    const linkAnimations = new LinkUnderlineAnimations();
    console.log('[Interactions] Link underline animations initialized');

    // Expose for debugging (optional)
    if (window.pmIntegration) {
      window.pmIntegration.interactions = {
        neuralGlow,
        linkAnimations,
        config: CONFIG
      };
    }
  }

  /* ========================================
     DOM READY
     ======================================== */

  // Initialize when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractions);
  } else {
    // DOM already loaded
    initInteractions();
  }

})();
