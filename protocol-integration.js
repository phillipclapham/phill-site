/**
 * Protocol Memory Site Integration Library
 *
 * Drop-in JavaScript library that powers your website with Protocol Memory public profile data.
 * Auto-updates your site with current state, active projects, and expertise from your Protocol Memory profile.
 *
 * Features:
 * - Auto-refresh every 5 minutes (configurable)
 * - Graceful fallback to static content
 * - Zero dependencies (vanilla JavaScript)
 * - Framework-agnostic
 * - Works for ANY Protocol Memory username
 *
 * Usage:
 * ```html
 * <script src="protocol-integration.js"></script>
 * <script>
 *   const integration = new ProtocolIntegration('your-username', {
 *     apiUrl: 'https://YOUR-PROJECT.supabase.co/functions/v1/public-profile',
 *     refreshInterval: 5 * 60 * 1000 // 5 minutes
 *   });
 *   integration.init();
 * </script>
 * ```
 *
 * Required HTML elements (all optional, library only updates elements that exist):
 * - #pm-current-state: Current state (focus, energy, location, availability)
 * - #pm-about: About section (tagline, role)
 * - #pm-projects: Active projects (from seeds)
 * - #pm-expertise: Expertise areas (from contexts)
 * - #pm-last-updated: Last updated indicator with attribution
 *
 * @version 1.0.0
 * @author Protocol Memory
 * @license MIT
 */

class ProtocolIntegration {
  /**
   * Create a new Protocol Memory integration
   *
   * @param {string} username - Protocol Memory username (from public profile URL)
   * @param {Object} options - Configuration options
   * @param {string} options.apiUrl - API endpoint (default: auto-detect from Supabase)
   * @param {string} options.anonKey - Supabase anon key for authentication (default: Protocol Memory production key)
   * @param {number} options.refreshInterval - Auto-refresh interval in milliseconds (default: 5 minutes)
   * @param {number} options.retryDelay - Retry delay on error in milliseconds (default: 30 seconds)
   * @param {boolean} options.debug - Enable debug logging (default: false)
   */
  constructor(username, options = {}) {
    this.username = username;

    // Configuration with defaults
    this.config = {
      apiUrl: options.apiUrl || 'https://urfuxifxphtqsrkuoifn.supabase.co/functions/v1/public-profile',
      anonKey: options.anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZnV4aWZ4cGh0cXNya3VvaWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTY5NzUsImV4cCI6MjA3MzYzMjk3NX0.i_OioOUbgn6BN-38-ps26siSY4_iRH6Ac3boAHywPng',
      refreshInterval: options.refreshInterval || (5 * 60 * 1000), // 5 minutes
      retryDelay: options.retryDelay || (30 * 1000), // 30 seconds
      debug: options.debug || false
    };

    this.lastUpdate = null;
    this.data = null;
    this.refreshTimer = null;

    this.log('Protocol Memory Integration initialized', { username, config: this.config });
  }

  /**
   * Initialize integration - fetch data and start auto-refresh
   * Call this method after creating the instance
   */
  async init() {
    this.log('🔮 Protocol Memory: Initializing...');
    await this.loadProtocolData();
    this.startAutoRefresh();
  }

  /**
   * Fetch data from Protocol Memory API
   * Updates DOM automatically on success
   */
  async loadProtocolData() {
    try {
      const apiUrl = `${this.config.apiUrl}/${this.username}`;
      this.log(`📡 Fetching from: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.anonKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.data = await response.json();
      this.lastUpdate = new Date();

      this.log('✅ Protocol Memory: Data loaded', this.data);

      // Update all site sections
      this.updateCurrentState(this.data.fields?.current_state);
      this.updateAbout(this.data.fields?.identity, this.data.fields?.about);
      this.updateProjects(this.data.seeds);
      this.updateExpertise(this.data.contexts);
      this.updateLastUpdatedIndicator();

    } catch (error) {
      this.log('⚠️ Protocol Memory: Using static fallback', error.message);
      // Graceful fallback - site continues with static content
      this.showStaticContent();
    }
  }

  /**
   * Update Current State section
   * Displays: focus, energy, location, availability
   *
   * @param {Object} currentState - Current state data from API
   */
  updateCurrentState(currentState) {
    if (!currentState) return;

    const stateEl = document.getElementById('pm-current-state');
    if (!stateEl) return;

    const { focus, energy, location, availability } = currentState;

    // Build energy display (handle both simple and complex formats)
    let energyHTML = '';
    if (energy) {
      if (typeof energy === 'string') {
        // Simple format: just a string
        energyHTML = `
          <div class="pm-state-item">
            <span class="pm-label">Energy:</span>
            <span class="pm-value">${this.escapeHtml(energy)}</span>
          </div>
        `;
      } else if (energy.display) {
        // Display format with optional timestamp
        const timestampText = energy.updated_at
          ? ` <small>(${this.formatRelativeTime(energy.updated_at)})</small>`
          : '';
        energyHTML = `
          <div class="pm-state-item">
            <span class="pm-label">Energy:</span>
            <span class="pm-value">${this.escapeHtml(energy.display)}${timestampText}</span>
          </div>
        `;
      }
    }

    stateEl.innerHTML = `
      <div class="pm-state-grid">
        ${focus ? `
          <div class="pm-state-item">
            <span class="pm-label">Current Focus:</span>
            <span class="pm-value">${this.escapeHtml(focus)}</span>
          </div>
        ` : ''}
        ${energyHTML}
        ${location ? `
          <div class="pm-state-item">
            <span class="pm-label">Location:</span>
            <span class="pm-value">${this.escapeHtml(location)}</span>
          </div>
        ` : ''}
        ${availability ? `
          <div class="pm-state-item">
            <span class="pm-label">Availability:</span>
            <span class="pm-value">${this.escapeHtml(availability)}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Update About section
   * Displays: tagline, role, current work
   *
   * @param {Object} identity - Identity fields
   * @param {Object} about - About fields
   */
  updateAbout(identity, about) {
    const aboutEl = document.getElementById('pm-about');
    if (!aboutEl) return;

    const tagline = about?.tagline || identity?.philosophy || '';
    const role = identity?.role || about?.current_work || '';
    const name = identity?.name || '';

    aboutEl.innerHTML = `
      ${name ? `<p class="pm-name">${this.escapeHtml(name)}</p>` : ''}
      ${tagline ? `<p class="pm-tagline">${this.escapeHtml(tagline)}</p>` : ''}
      ${role ? `<p class="pm-role">${this.escapeHtml(role)}</p>` : ''}
    `;
  }

  /**
   * Update Active Projects section (from conversation seeds)
   * Displays top 5 seeds ordered by priority
   *
   * @param {Array} seeds - Array of seed objects
   */
  updateProjects(seeds) {
    const projectsEl = document.getElementById('pm-projects');
    if (!projectsEl) return;

    if (!seeds || seeds.length === 0) {
      projectsEl.innerHTML = '<p class="pm-empty">No active projects shared publicly.</p>';
      return;
    }

    // Priority order for sorting
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };

    // Show top 5 seeds by priority
    const topSeeds = seeds
      .sort((a, b) => {
        return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
      })
      .slice(0, 5);

    projectsEl.innerHTML = `
      <ul class="pm-projects-list">
        ${topSeeds.map(seed => `
          <li class="pm-project-item">
            <div class="pm-project-header">
              <span class="pm-project-title">${this.escapeHtml(seed.text || seed.title || 'Untitled')}</span>
              ${seed.priority ? `<span class="pm-priority pm-priority-${seed.priority}">${seed.priority}</span>` : ''}
            </div>
            ${seed.description ? `
              <p class="pm-project-desc">${this.escapeHtml(seed.description)}</p>
            ` : ''}
            ${seed.tags && seed.tags.length > 0 ? `
              <div class="pm-project-tags">
                ${seed.tags.map(tag => `<span class="pm-tag">${this.escapeHtml(tag)}</span>`).join('')}
              </div>
            ` : ''}
          </li>
        `).join('')}
      </ul>
    `;
  }

  /**
   * Update Expertise section (from contexts)
   * Displays expertise areas with preview text
   *
   * @param {Array} contexts - Array of context objects
   */
  updateExpertise(contexts) {
    const expertiseEl = document.getElementById('pm-expertise');
    if (!expertiseEl) return;

    if (!contexts || contexts.length === 0) {
      expertiseEl.innerHTML = '<p class="pm-empty">No expertise areas shared publicly.</p>';
      return;
    }

    expertiseEl.innerHTML = `
      <div class="pm-expertise-grid">
        ${contexts.map(context => `
          <div class="pm-expertise-card">
            <h3 class="pm-expertise-name">${this.escapeHtml(context.name)}</h3>
            ${context.type ? `<p class="pm-expertise-type">${this.escapeHtml(context.type)}</p>` : ''}
            ${context.content ? `
              <p class="pm-expertise-preview">${this.escapeHtml(context.content.substring(0, 150))}${context.content.length > 150 ? '...' : ''}</p>
            ` : ''}
            ${context.tags && context.tags.length > 0 ? `
              <div class="pm-expertise-tags">
                ${context.tags.map(tag => `<span class="pm-tag">${this.escapeHtml(tag)}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Update "Last Updated" indicator
   * Shows timestamp and "Powered by Protocol Memory" attribution
   */
  updateLastUpdatedIndicator() {
    const indicatorEl = document.getElementById('pm-last-updated');
    if (!indicatorEl) return;

    const timeAgo = this.formatRelativeTime(this.lastUpdate);
    indicatorEl.innerHTML = `
      <span class="pm-indicator">
        <span class="pm-dot"></span>
        Updated ${timeAgo} via
        <a href="https://protocol-memory.pages.dev" target="_blank" rel="noopener">Protocol Memory</a>
      </span>
    `;
  }

  /**
   * Show static content when API unavailable
   * Displays offline indicator but keeps existing static HTML
   */
  showStaticContent() {
    const indicatorEl = document.getElementById('pm-last-updated');
    if (indicatorEl) {
      indicatorEl.innerHTML = `
        <span class="pm-indicator pm-offline">
          <span class="pm-dot"></span>
          Showing static content
        </span>
      `;
    }
  }

  /**
   * Start auto-refresh loop
   * Fetches fresh data at configured interval
   */
  startAutoRefresh() {
    // Clear existing timer if any
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.refreshTimer = setInterval(() => {
      this.log('🔄 Protocol Memory: Auto-refreshing...');
      this.loadProtocolData();
    }, this.config.refreshInterval);

    this.log(`⏰ Auto-refresh started (every ${this.config.refreshInterval / 1000}s)`);
  }

  /**
   * Stop auto-refresh loop
   * Useful for cleanup or manual control
   */
  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      this.log('⏸️ Auto-refresh stopped');
    }
  }

  /**
   * Manual refresh
   * Forces immediate data fetch
   */
  async refresh() {
    this.log('🔄 Manual refresh triggered');
    await this.loadProtocolData();
  }

  /**
   * Get current data
   * Returns the most recently fetched data
   *
   * @returns {Object} Current profile data
   */
  getData() {
    return this.data;
  }

  /**
   * Escape HTML to prevent XSS
   *
   * @param {string} text - Text to escape
   * @returns {string} Escaped HTML
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Format timestamp as relative time
   * Examples: "just now", "2m ago", "3h ago", "2 days ago"
   *
   * @param {Date|string} timestamp - Date object or ISO string
   * @returns {string} Formatted relative time
   */
  formatRelativeTime(timestamp) {
    if (!timestamp) return 'recently';

    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 120) return '1 minute ago';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 7200) return '1 hour ago';
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 172800) return 'yesterday';
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

    return 'recently';
  }

  /**
   * Log debug messages
   * Only logs when debug mode enabled
   *
   * @param {...any} args - Arguments to log
   */
  log(...args) {
    if (this.config.debug) {
      console.log('[Protocol Memory]', ...args);
    }
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProtocolIntegration;
}

// Expose globally for browser usage
if (typeof window !== 'undefined') {
  window.ProtocolIntegration = ProtocolIntegration;
}
