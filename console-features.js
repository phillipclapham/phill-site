/**
 * Console Features - Session 4: Hidden Commands & Easter Eggs
 *
 * Design Philosophy: "Make the quiet parts louder"
 * - Console is a delightful discovery for curious developers
 * - Commands provide playful interaction with site features
 * - Performance monitoring helps understand the system
 *
 * Features:
 * - ASCII art welcome message (shown once per session)
 * - window.pm namespace with hidden commands
 * - Performance stats (FPS, animation count, memory)
 * - Philosophy quotes library
 * - Founder Mode toggle exposure
 * - Game of Life control
 */

(function() {
  'use strict';

  /* ========================================
     CONFIGURATION
     ======================================== */

  const CONFIG = {
    version: '2.0.0',
    sessionKey: 'pm-console-shown',
    welcomeShown: false,
  };

  /* ========================================
     CONSOLE STYLING
     ======================================== */

  const styles = {
    title: 'color: #0F766E; font-size: 18px; font-weight: bold;',
    subtitle: 'color: #14B8A6; font-size: 12px;',
    text: 'color: #64748B; font-size: 11px;',
    command: 'color: #14B8A6; font-weight: bold;',
    accent: 'color: #EC4899; font-weight: bold;',
    dim: 'color: #94A3B8; font-size: 10px;',
  };

  /* ========================================
     ASCII ART WELCOME
     ======================================== */

  function showWelcome() {
    // Check if already shown this session
    if (sessionStorage.getItem(CONFIG.sessionKey)) {
      return;
    }

    console.log('%c╔═══════════════════════════════════════╗', styles.title);
    console.log('%c║   PROTOCOL MEMORY                     ║', styles.title);
    console.log('%c║   Personal Site v' + CONFIG.version + '                 ║', styles.title);
    console.log('%c╚═══════════════════════════════════════╝', styles.title);
    console.log('');
    console.log('%cCurious developer detected! 👋', styles.subtitle);
    console.log('%cThis site is built with Protocol Memory - continuity for AI agents.', styles.text);
    console.log('');
    console.log('%cTry typing: %cpm.help()', styles.text, styles.command);
    console.log('');

    // Mark as shown
    sessionStorage.setItem(CONFIG.sessionKey, 'true');
    CONFIG.welcomeShown = true;
  }

  /* ========================================
     PHILOSOPHY QUOTES
     ======================================== */

  const philosophyQuotes = [
    "Make the quiet parts louder, not the loud parts deafening.",
    "Sophistication through restraint.",
    "The best feature is the one you know when to stop adding to.",
    "Build tools that respect the builder.",
    "Sometimes the best feature is the one you enhance, not the one you add.",
    "Keep animated layer count LOW. Quality over quantity.",
    "If it's causing issues or the user doesn't like it, remove it - no attachment to code.",
    "Effects are intentional, not passive.",
    "Document decisions, not process.",
    "Every line of documentation must earn its keep.",
  ];

  let lastQuoteIndex = -1;

  function getRandomQuote() {
    // Avoid repeating the same quote twice in a row
    let index;
    do {
      index = Math.floor(Math.random() * philosophyQuotes.length);
    } while (index === lastQuoteIndex && philosophyQuotes.length > 1);

    lastQuoteIndex = index;
    return philosophyQuotes[index];
  }

  /* ========================================
     PERFORMANCE STATS
     ======================================== */

  const perfMonitor = {
    frameCount: 0,
    lastTime: performance.now(),
    fpsHistory: [],
    maxHistorySize: 60,

    // Start monitoring FPS
    start() {
      const measureFPS = (currentTime) => {
        this.frameCount++;
        const elapsed = currentTime - this.lastTime;

        if (elapsed >= 1000) {
          const fps = Math.round((this.frameCount * 1000) / elapsed);
          this.fpsHistory.push(fps);

          if (this.fpsHistory.length > this.maxHistorySize) {
            this.fpsHistory.shift();
          }

          this.frameCount = 0;
          this.lastTime = currentTime;
        }

        requestAnimationFrame(measureFPS);
      };

      requestAnimationFrame(measureFPS);
    },

    // Get current FPS (average of last 60 frames)
    getCurrentFPS() {
      if (this.fpsHistory.length === 0) return 60;
      const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
      return Math.round(sum / this.fpsHistory.length);
    },

    // Get animation count
    getAnimationCount() {
      const animations = document.getAnimations ? document.getAnimations() : [];
      return animations.length;
    },

    // Get memory usage (if available)
    getMemoryUsage() {
      if (performance.memory) {
        const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
        const total = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);
        return { used, total, available: true };
      }
      return { available: false };
    },
  };

  // Start monitoring on load
  perfMonitor.start();

  /* ========================================
     WINDOW.PM NAMESPACE
     ======================================== */

  /**
   * Main namespace for Protocol Memory console commands
   */
  const pm = {
    /**
     * Show all available commands
     */
    help() {
      console.log('');
      console.log('%c╔═══════════════════════════════════════╗', styles.title);
      console.log('%c║   PROTOCOL MEMORY COMMANDS            ║', styles.title);
      console.log('%c╚═══════════════════════════════════════╝', styles.title);
      console.log('');
      console.log('%cpm.help()      %c→ Show this help message', styles.command, styles.text);
      console.log('%cpm.founder()   %c→ Toggle Founder Mode', styles.command, styles.text);
      console.log('%cpm.quote()     %c→ Random philosophy quote', styles.command, styles.text);
      console.log('%cpm.stats()     %c→ Performance statistics', styles.command, styles.text);
      console.log('%cpm.version()   %c→ Show version info', styles.command, styles.text);
      console.log('');
      console.log('%c╔═══════════════════════════════════════╗', styles.accent);
      console.log('%c║   GAME OF LIFE CONTROLS               ║', styles.accent);
      console.log('%c╚═══════════════════════════════════════╝', styles.accent);
      console.log('');
      console.log('%cpm.gol.pause()   %c→ Pause/play simulation', styles.command, styles.text);
      console.log('%cpm.gol.reset()   %c→ Reset to new pattern', styles.command, styles.text);
      console.log('%cpm.gol.speed(n)  %c→ Set FPS (1-30)', styles.command, styles.text);
      console.log('');
      console.log('%cTip: You can also click the footer to pause, and edit cells when paused!', styles.dim);
      console.log('%cKeyboard: Press SPACE to pause/play the simulation.', styles.dim);
      console.log('');

      return '✓ Help displayed';
    },

    /**
     * Toggle Founder Mode
     */
    founder() {
      if (typeof window.founderModeState === 'undefined') {
        console.log('%c✗ Founder Mode not available (script not loaded)', styles.text);
        return false;
      }

      window.founderModeState.toggle();
      const isActive = window.founderModeState.active;

      console.log(
        `%c${isActive ? '🌀 Founder Mode activated' : '🎯 Professional Mode activated'}`,
        isActive ? styles.accent : styles.command
      );

      return isActive;
    },

    /**
     * Display random philosophy quote
     */
    quote() {
      const quote = getRandomQuote();
      console.log('');
      console.log('%c❝ ' + quote + ' ❞', styles.accent);
      console.log('');
      return quote;
    },

    /**
     * Show performance statistics
     */
    stats() {
      const fps = perfMonitor.getCurrentFPS();
      const animations = perfMonitor.getAnimationCount();
      const memory = perfMonitor.getMemoryUsage();

      console.log('');
      console.log('%c╔═══════════════════════════════════════╗', styles.title);
      console.log('%c║   PERFORMANCE STATISTICS              ║', styles.title);
      console.log('%c╚═══════════════════════════════════════╝', styles.title);
      console.log('');
      console.log('%cFPS (avg):        %c' + fps + ' fps', styles.text, styles.command);
      console.log('%cAnimations:       %c' + animations, styles.text, styles.command);

      if (memory.available) {
        console.log('%cMemory (used):    %c' + memory.used + ' MB', styles.text, styles.command);
        console.log('%cMemory (limit):   %c' + memory.total + ' MB', styles.text, styles.dim);
      } else {
        console.log('%cMemory:           %cNot available', styles.text, styles.dim);
      }

      console.log('');

      return {
        fps,
        animations,
        memory: memory.available ? { used: memory.used, total: memory.total } : null,
      };
    },

    /**
     * Show version information
     */
    version() {
      console.log('');
      console.log('%cProtocol Memory Personal Site', styles.subtitle);
      console.log('%cVersion: %c' + CONFIG.version, styles.text, styles.command);
      console.log('%cBuilt with: %cProtocol Memory + Claude Code', styles.text, styles.command);
      console.log('');
      return CONFIG.version;
    },

    /**
     * Game of Life controls namespace
     */
    gol: {
      /**
       * Pause/play the simulation
       */
      pause() {
        if (typeof window.golInstance === 'undefined') {
          console.log('%c✗ Game of Life not available', styles.text);
          return false;
        }

        window.golInstance.togglePause();
        const isPaused = window.golInstance.manuallyPaused;

        console.log(
          `%c${isPaused ? '⏸️  Paused' : '▶️  Playing'}`,
          styles.accent
        );

        return isPaused;
      },

      /**
       * Reset to new random pattern
       */
      reset() {
        if (typeof window.golInstance === 'undefined') {
          console.log('%c✗ Game of Life not available', styles.text);
          return false;
        }

        window.golInstance.seedPattern();
        console.log('%c🔄 Pattern reset', styles.command);

        return true;
      },

      /**
       * Set simulation speed (FPS)
       * @param {number} fps - Frames per second (1-30)
       */
      speed(fps) {
        if (typeof window.golInstance === 'undefined') {
          console.log('%c✗ Game of Life not available', styles.text);
          return false;
        }

        if (typeof fps !== 'number' || fps < 1 || fps > 30) {
          console.log('%c✗ FPS must be between 1 and 30', styles.text);
          return false;
        }

        window.golInstance.setFPS(fps);
        console.log(`%c⚡ Speed set to ${fps} FPS`, styles.command);

        return true;
      },
    },
  };

  /* ========================================
     INITIALIZATION
     ======================================== */

  // Check for namespace collision
  if (window.pm) {
    console.warn('[Protocol Memory] window.pm namespace already exists! Commands may not work correctly.');
  }

  // Expose namespace
  window.pm = pm;

  // Show welcome message on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showWelcome);
  } else {
    showWelcome();
  }

  // Debug log (only if enabled)
  if (window.pmIntegration?.debug) {
    console.log('[Console Features] Initialized - Try pm.help()');
  }

})();
