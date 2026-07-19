/**
 * Principle Network - Topological Evidence Board with Modal
 * Demonstrates FlowScript's vision: ideas connecting in thought-space
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Principle data lookup
  const principleData = {
    'memory': {
      title: 'Memory',
      subtitle: 'State that survives the session',
      detail: 'A generator with no persistence starts every conversation as a stranger. Memory is the first governing layer: episodes compress into continuity, associations form between them, and what persists is a perspective rather than a transcript. Without it, nothing downstream can compound.',
      connects: ['verification', 'invariants', 'anneal']
    },
    'verification': {
      title: 'Verification',
      subtitle: 'Grounding beats recall',
      detail: 'Memory without grounding is amplification infrastructure — it makes whatever is in there louder, true or not. Verification is the layer that checks a claim against a source before it is allowed to count. A failed read must surface as unknown, never as a false all-clear.',
      connects: ['memory', 'invariants', 'governance']
    },
    'invariants': {
      title: 'Invariants',
      subtitle: 'Structure beats discipline',
      detail: 'Discipline drifts, then gets bypassed. An invariant refuses. The guard has to be structurally unskippable rather than a contract you promise to honour — fail closed, not fail quiet. This is why the immune system spans all four layers instead of sitting beside them.',
      connects: ['verification', 'governance', 'levain']
    },
    'governance': {
      title: 'Governance',
      subtitle: 'Govern, don\'t trust',
      detail: 'As agents get more capable, the edge stops being raw capability and becomes oversight. Nothing reaches long-term memory except through a path you govern; every governed change is recorded; the audit trail is hash-chained so tampering is evident. Built into the architecture, not bolted on after.',
      connects: ['invariants', 'verification', 'paper']
    },
    'anneal': {
      title: 'anneal-memory',
      subtitle: 'The constructive proof',
      detail: 'Four cognitive layers — episodic store, continuity file, Hebbian association, affective state — with an immune system spanning all four and a hash-chained JSONL audit trail. It exists so the paper\'s section 9 is demonstrable rather than asserted. v0.9.6, 1,642 tests, zero dependencies, MIT.',
      connects: ['memory', 'invariants', 'levain']
    },
    'levain': {
      title: 'Levain',
      subtitle: 'Ship the seed, not the fossil',
      detail: 'A practice transfers as a living starter or not at all. Hand someone the grown practice and they receive a fossil: correct in shape, dead in function. Levain ships the seed — methodology core, harness adapters, scripted onboarding — built on anneal-memory as a layer-1 dependency.',
      connects: ['anneal', 'governance', 'thesis']
    },
    'paper': {
      title: 'A Structural Theory of Harnesses',
      subtitle: 'The discipline, named',
      detail: 'Generalized intelligence lives in the arrangement around the generator, not inside the model. The first complete theoretical account of harness engineering as a named field: convergent biological and frontier-AI evidence, and a mechanism catalog of six harness properties. The work was already there; the paper named it.',
      connects: ['governance', 'memory', 'thesis']
    },
    'thesis': {
      title: 'The augmentation thesis',
      subtitle: 'Fuse above the threshold',
      detail: 'Above a task-complexity threshold — judgment, taste, strategy over context outside the model\'s purview — replacing human labour with AI costs more AND produces worse results than fusing human and machine through a harness. Below it, substitution proceeds. Harness design is the architectural primitive of that era.',
      connects: ['paper', 'levain']
    }
  };

  /**
   * Get center point of an element
   */
  function getElementCenter(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    return {
      x: rect.left + scrollLeft + rect.width / 2,
      y: rect.top + scrollTop + rect.height / 2
    };
  }

  /**
   * Draw curved SVG line between two points
   */
  function drawCurvedLine(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    // Create gentle curve
    const cx1 = start.x + dx * 0.25 - dy * 0.1;
    const cy1 = start.y + dy * 0.25 + dx * 0.1;
    const cx2 = start.x + dx * 0.75 + dy * 0.1;
    const cy2 = start.y + dy * 0.75 - dx * 0.1;

    return `M ${start.x},${start.y} C ${cx1},${cy1} ${cx2},${cy2} ${end.x},${end.y}`;
  }

  /**
   * Draw all connection lines
   */
  function drawConnections() {
    const svg = document.querySelector('.principle-connections');
    if (!svg) return;

    const board = document.querySelector('.principle-board');
    if (!board) return;

    svg.innerHTML = '';

    const boardRect = board.getBoundingClientRect();
    svg.setAttribute('width', boardRect.width);
    svg.setAttribute('height', boardRect.height);
    svg.setAttribute('viewBox', `0 0 ${boardRect.width} ${boardRect.height}`);

    // Add spectrum gradient definition for connection lines
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'spectrumGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    const stops = [
      { offset: '0%', color: '#00a8ab' },    // Teal
      { offset: '33%', color: '#a855f7' },   // Purple
      { offset: '66%', color: '#ec4899' },   // Magenta
      { offset: '100%', color: '#D4AF37' }   // Gold
    ];

    stops.forEach(stop => {
      const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stopElement.setAttribute('offset', stop.offset);
      stopElement.setAttribute('stop-color', stop.color);
      gradient.appendChild(stopElement);
    });

    defs.appendChild(gradient);
    svg.appendChild(defs);

    const cards = Array.from(document.querySelectorAll('.principle-card'));
    const drawn = new Set();

    cards.forEach(card => {
      const cardId = card.id.replace('principle-', '');
      const connects = card.dataset.connects ? card.dataset.connects.split(',') : [];

      connects.forEach(targetId => {
        const connectionKey = [cardId, targetId].sort().join('-');
        if (drawn.has(connectionKey)) return;
        drawn.add(connectionKey);

        const targetCard = document.getElementById(`principle-${targetId}`);
        if (!targetCard) return;

        const boardPos = board.getBoundingClientRect();
        const startRect = card.getBoundingClientRect();
        const endRect = targetCard.getBoundingClientRect();

        const start = {
          x: startRect.left - boardPos.left + startRect.width / 2,
          y: startRect.top - boardPos.top + startRect.height / 2
        };

        const end = {
          x: endRect.left - boardPos.left + endRect.width / 2,
          y: endRect.top - boardPos.top + endRect.height / 2
        };

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', drawCurvedLine(start, end));
        path.classList.add('connection-line');
        path.dataset.from = cardId;
        path.dataset.to = targetId;

        svg.appendChild(path);
      });
    });
  }

  /**
   * Highlight connections for a card
   */
  function highlightConnections(cardId, highlight) {
    const card = document.getElementById(`principle-${cardId}`);
    if (!card) return;

    const connects = card.dataset.connects ? card.dataset.connects.split(',') : [];

    const lines = document.querySelectorAll('.connection-line');
    lines.forEach(line => {
      const from = line.dataset.from;
      const to = line.dataset.to;

      if (from === cardId || to === cardId) {
        if (highlight) {
          line.classList.add('highlighted');
        } else {
          line.classList.remove('highlighted');
        }
      }
    });

    connects.forEach(targetId => {
      const targetCard = document.getElementById(`principle-${targetId}`);
      if (targetCard) {
        if (highlight) {
          targetCard.classList.add('connected');
        } else {
          targetCard.classList.remove('connected');
        }
      }
    });
  }

  /**
   * Open modal with principle details
   */
  function openModal(principleId) {
    const modal = document.getElementById('principle-modal');
    if (!modal) return;

    const data = principleData[principleId];
    if (!data) return;

    // Populate modal content
    modal.querySelector('.modal-title').textContent = data.title;
    modal.querySelector('.modal-subtitle').textContent = data.subtitle;
    modal.querySelector('.modal-detail').textContent = data.detail;

    // Populate connected principles
    const connectionLinks = modal.querySelector('.connection-links');
    connectionLinks.innerHTML = '';

    data.connects.forEach(connectedId => {
      const connectedData = principleData[connectedId];
      if (!connectedData) return;

      const link = document.createElement('div');
      link.className = 'connection-link';
      link.dataset.principleId = connectedId;

      const title = document.createElement('div');
      title.className = 'connection-link-title';
      title.textContent = connectedData.title;

      link.appendChild(title);
      connectionLinks.appendChild(link);

      // Click to navigate to connected principle
      link.addEventListener('click', () => {
        openModal(connectedId);
      });
    });

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Highlight connections in background
    highlightConnections(principleId, true);
  }

  /**
   * Close modal
   */
  function closeModal() {
    const modal = document.getElementById('principle-modal');
    if (!modal) return;

    modal.style.display = 'none';
    document.body.style.overflow = '';

    // Unhighlight all connections
    const cards = document.querySelectorAll('.principle-card');
    cards.forEach(card => card.classList.remove('connected'));

    const lines = document.querySelectorAll('.connection-line');
    lines.forEach(line => line.classList.remove('highlighted'));
  }

  /**
   * Setup card interactions
   */
  function setupCardInteractions() {
    const cards = document.querySelectorAll('.principle-card');

    cards.forEach(card => {
      const cardId = card.id.replace('principle-', '');

      // Hover: highlight connections only (no expansion)
      card.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion) {
          highlightConnections(cardId, true);
        }
      });

      card.addEventListener('mouseleave', () => {
        if (!prefersReducedMotion) {
          // Don't unhighlight if modal is open for this card
          const modal = document.getElementById('principle-modal');
          if (!modal || modal.style.display === 'none') {
            highlightConnections(cardId, false);
          }
        }
      });

      // Click: open modal
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(cardId);
      });
    });

    // Close modal on backdrop click or close button
    const modal = document.getElementById('principle-modal');
    if (modal) {
      const backdrop = modal.querySelector('.modal-backdrop');
      const closeBtn = modal.querySelector('.modal-close');

      if (backdrop) {
        backdrop.addEventListener('click', closeModal);
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }

      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
          closeModal();
        }
      });
    }
  }

  /**
   * Initialize
   */
  function init() {
    const board = document.querySelector('.principle-board');
    if (!board) return;

    drawConnections();
    setupCardInteractions();

    // Redraw on resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(drawConnections, 250);
    });

    // Redraw after fonts load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(drawConnections, 100);
      });
    }
  }

  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
