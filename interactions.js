/**
 * Interactions.js - Sessions 1 & 2: Foundation + Hover Effects + Card Tilt + Ripples
 *
 * Handles:
 * - Neural pulse hover glow (distance-based intensity)
 * - Link underline spectrum gradient animations
 * - Card 3D tilt effects (Apple-style, mouse position-based)
 * - Click ripple system (Material Design-style, spectrum gradient)
 * - Mobile device orientation support (gyroscope tilt)
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

    // Card 3D Tilt (Session 2)
    tiltMaxDegrees: 10,         // Maximum tilt angle (±10 degrees)
    tiltSmoothness: 0.1,        // Lerp factor (0.1 = smooth, 0.5 = snappy)
    tiltUpdateThrottle: 16,     // Throttle mousemove to 60fps (16ms)

    // Click Ripples (Session 2)
    rippleMaxConcurrent: 3,     // Maximum number of concurrent ripples
    rippleDuration: 1000,       // Ripple animation duration (ms)
    rippleSize: 300,            // Maximum ripple diameter (px)

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
     CARD 3D TILT - SESSION 2
     ======================================== */

  class Card3DTilt {
    constructor() {
      // Target cards: project cards, expertise cards, state cards
      this.cards = document.querySelectorAll('.pm-project-item, .pm-expertise-card, .state-card, .current-state-grid .state-card');
      this.activeCard = null;
      this.currentRotation = { x: 0, y: 0 };
      this.targetRotation = { x: 0, y: 0 };
      this.isAnimating = false;

      // Skip on mobile (will use gyroscope instead) or if reduced motion preferred
      if (CONFIG.prefersReducedMotion) {
        return;
      }

      // Desktop: mouse-based tilt
      if (!CONFIG.isMobile) {
        this.initDesktopTilt();
      } else {
        // Mobile: device orientation tilt (optional)
        this.initMobileTilt();
      }
    }

    /**
     * Initialize desktop mouse-based tilt
     */
    initDesktopTilt() {
      this.cards.forEach(card => {
        // Add tiltable class for CSS targeting
        card.classList.add('tiltable-card');

        // Throttled mousemove for performance
        const throttledMouseMove = throttle((e) => {
          this.handleCardMouseMove(card, e);
        }, CONFIG.tiltUpdateThrottle);

        card.addEventListener('mouseenter', () => {
          this.activeCard = card;
        });

        card.addEventListener('mousemove', throttledMouseMove, { passive: true });

        card.addEventListener('mouseleave', () => {
          this.activeCard = null;
          this.resetTilt(card);
        });
      });

      console.log('[Card3DTilt] Desktop tilt initialized for', this.cards.length, 'cards');
    }

    /**
     * Handle mouse movement over card (calculate tilt)
     * @param {HTMLElement} card - The card element
     * @param {MouseEvent} e - Mouse event
     */
    handleCardMouseMove(card, e) {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      // Calculate mouse position relative to card center (-1 to 1 range)
      const relativeX = (e.clientX - cardCenterX) / (rect.width / 2);
      const relativeY = (e.clientY - cardCenterY) / (rect.height / 2);

      // Convert to rotation angles (±maxDegrees)
      // Invert Y axis for natural tilt (mouse up = card tilts back)
      this.targetRotation.x = -relativeY * CONFIG.tiltMaxDegrees;
      this.targetRotation.y = relativeX * CONFIG.tiltMaxDegrees;

      // Start smooth animation if not already running
      if (!this.isAnimating && this.activeCard === card) {
        this.animateTilt(card);
      }
    }

    /**
     * Smoothly animate tilt using requestAnimationFrame
     * @param {HTMLElement} card - The card element
     */
    animateTilt(card) {
      this.isAnimating = true;

      const animate = () => {
        // Smooth interpolation (lerp) towards target rotation
        const diffX = this.targetRotation.x - this.currentRotation.x;
        const diffY = this.targetRotation.y - this.currentRotation.y;

        if (Math.abs(diffX) > 0.1 || Math.abs(diffY) > 0.1) {
          this.currentRotation.x += diffX * CONFIG.tiltSmoothness;
          this.currentRotation.y += diffY * CONFIG.tiltSmoothness;
          this.applyTilt(card);

          if (this.activeCard === card) {
            requestAnimFrame(animate);
          } else {
            this.isAnimating = false;
          }
        } else {
          this.currentRotation.x = this.targetRotation.x;
          this.currentRotation.y = this.targetRotation.y;
          this.applyTilt(card);
          this.isAnimating = false;
        }
      };

      animate();
    }

    /**
     * Apply tilt transform to card
     * @param {HTMLElement} card - The card element
     */
    applyTilt(card) {
      card.style.transform = `perspective(1000px) rotateX(${this.currentRotation.x}deg) rotateY(${this.currentRotation.y}deg) translateZ(0)`;
    }

    /**
     * Reset card tilt to neutral position
     * @param {HTMLElement} card - The card element
     */
    resetTilt(card) {
      this.targetRotation = { x: 0, y: 0 };
      this.currentRotation = { x: 0, y: 0 };
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }

    /**
     * Initialize mobile device orientation tilt (optional enhancement)
     */
    initMobileTilt() {
      // Check if device orientation API is available
      if (!window.DeviceOrientationEvent) {
        console.log('[Card3DTilt] Device orientation not supported');
        return;
      }

      // Request permission on iOS 13+ (requires user interaction)
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS: requires explicit permission
        // Note: This would need a button click to trigger
        console.log('[Card3DTilt] Device orientation requires permission on iOS');
        return;
      }

      // Android or older iOS: permission granted automatically
      window.addEventListener('deviceorientation', (e) => {
        this.handleDeviceOrientation(e);
      }, { passive: true });

      console.log('[Card3DTilt] Mobile device orientation tilt initialized');
    }

    /**
     * Handle device orientation change (gyroscope)
     * @param {DeviceOrientationEvent} e - Device orientation event
     */
    handleDeviceOrientation(e) {
      // Beta: front-to-back tilt (-180 to 180)
      // Gamma: left-to-right tilt (-90 to 90)
      const beta = e.beta;   // Front-back tilt
      const gamma = e.gamma; // Left-right tilt

      // Normalize to ±1 range
      const normalizedBeta = Math.max(-1, Math.min(1, beta / 45));
      const normalizedGamma = Math.max(-1, Math.min(1, gamma / 45));

      // Apply subtle tilt to all cards (ambient effect)
      this.cards.forEach(card => {
        const tiltX = normalizedBeta * CONFIG.tiltMaxDegrees * 0.5; // 50% of max
        const tiltY = normalizedGamma * CONFIG.tiltMaxDegrees * 0.5;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
      });
    }
  }

  /* ========================================
     CLICK RIPPLES - SESSION 2
     ======================================== */

  class ClickRipples {
    constructor() {
      this.activeRipples = [];
      this.rippleContainer = null;

      // Skip if reduced motion preferred
      if (CONFIG.prefersReducedMotion) {
        return;
      }

      this.init();
    }

    /**
     * Initialize click ripple system
     */
    init() {
      // Create ripple container (appended to body)
      this.rippleContainer = document.createElement('div');
      this.rippleContainer.className = 'ripple-container';
      this.rippleContainer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.rippleContainer);

      // Listen for clicks on interactive elements
      const clickTargets = document.querySelectorAll('a, button, .pm-project-item, .pm-expertise-card, .state-card, .current-state-grid .state-card');

      clickTargets.forEach(element => {
        element.addEventListener('click', (e) => {
          this.createRipple(e.clientX, e.clientY);
        }, { passive: true });
      });

      console.log('[ClickRipples] Ripple system initialized for', clickTargets.length, 'elements');
    }

    /**
     * Create ripple at click coordinates
     * @param {Number} x - Click X coordinate
     * @param {Number} y - Click Y coordinate
     */
    createRipple(x, y) {
      // Remove oldest ripple if at max concurrent limit
      if (this.activeRipples.length >= CONFIG.rippleMaxConcurrent) {
        const oldestRipple = this.activeRipples.shift();
        if (oldestRipple && oldestRipple.element.parentNode) {
          oldestRipple.element.remove();
        }
      }

      // Create ripple element
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      // Add to container
      this.rippleContainer.appendChild(ripple);

      // Track active ripple
      const rippleData = {
        element: ripple,
        timestamp: Date.now()
      };
      this.activeRipples.push(rippleData);

      // Auto-remove after animation completes
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.remove();
        }
        // Remove from tracking array
        const index = this.activeRipples.indexOf(rippleData);
        if (index > -1) {
          this.activeRipples.splice(index, 1);
        }
      }, CONFIG.rippleDuration);
    }
  }

  /* ========================================
     INITIALIZATION
     ======================================== */

  /**
   * Initialize all interactions when DOM is ready
   */
  function initInteractions() {
    // Check if we should skip interactions (reduced motion)
    // Note: We no longer skip ALL interactions on mobile - some work on touch!
    if (CONFIG.prefersReducedMotion) {
      console.log('[Interactions] Reduced motion preference detected - skipping animations');
      return;
    }

    // Initialize Neural Pulse Glow (desktop only)
    let neuralGlow = null;
    if (!CONFIG.isMobile) {
      neuralGlow = new NeuralPulseGlow();
      console.log('[Interactions] Neural pulse glow initialized');
    }

    // Initialize Link Underline Animations (desktop only)
    let linkAnimations = null;
    if (!CONFIG.isMobile) {
      linkAnimations = new LinkUnderlineAnimations();
      console.log('[Interactions] Link underline animations initialized');
    }

    // Initialize Card 3D Tilt (Session 2) - works on desktop + mobile
    const cardTilt = new Card3DTilt();
    console.log('[Interactions] Card 3D tilt initialized');

    // Initialize Click Ripples (Session 2) - works on desktop + mobile
    const clickRipples = new ClickRipples();
    console.log('[Interactions] Click ripples initialized');

    // Expose for debugging (optional)
    if (window.pmIntegration) {
      window.pmIntegration.interactions = {
        neuralGlow,
        linkAnimations,
        cardTilt,
        clickRipples,
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
