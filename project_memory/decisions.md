# Key Design Decisions

## Architecture Decisions

### Single-File Structure
**Decision**: Keep everything in `index.html` with embedded CSS/JS
**Reasoning**: Eliminates dependencies, simplifies deployment, embodies energetic economy
**Trade-off**: Larger initial file size vs. zero external requests

### Hash-Based Routing
**Decision**: Use `#blog`, `#blog-post-slug` format instead of `/blog/post-slug`
**Reasoning**: GitHub Pages compatibility - path-based routing causes 404s on direct access
**Impact**: URLs work for sharing and direct navigation without server configuration

### Build System Approach
**Decision**: Node.js build script that processes markdown and updates `index.html`
**Reasoning**: Minimal tooling, leverages existing ecosystem (marked + gray-matter)
**Alternative considered**: Static site generators (rejected as too complex for single-file goal)

### Blog Content Storage
**Decision**: Markdown files in `/posts` directory with YAML frontmatter
**Reasoning**: Standard approach, enables categories/tags, human-readable
**Structure**: `title`, `date`, `excerpt`, `slug`, `tags[]`, `category`

## UX Decisions

### Terminal Aesthetic
**Decision**: Dark theme with IBM Plex Mono, amber/green accents
**Reasoning**: Aligns with wu wei philosophy and "hollow reed" metaphor
**Colors**: `--accent-green: #00ff41`, `--accent-amber: #ffb000`

### Category Navigation Format
**Decision**: "All • Life Notes • Poetry • Politics" with bullet separators
**Reasoning**: Clean visual separation, follows terminal/CLI conventions
**Rejected**: Dropdown menus (too complex), tabs (not minimal enough)

### Event Handling
**Decision**: `event.stopPropagation()` on tag/category clicks
**Reasoning**: Prevents unintended post navigation when user wants to filter
**Impact**: Intuitive filtering behavior on archive page

## Technical Decisions

### JavaScript Duplication Issue
**Problem**: Build script was appending instead of replacing JavaScript functions
**Solution**: Loop-based removal of all existing blog JavaScript before adding new
**Learning**: Regex replacement insufficient for multiple instances

### URL Parameter Format
**Decision**: `#blog?category=Politics` for filtered views
**Reasoning**: Maintains hash routing while supporting query parameters
**Implementation**: URLSearchParams parsing within hash fragment

## Wu Wei Principles Applied

### Minimal Interference
Let the blog system emerge from actual needs rather than assumed requirements. Started with simplest possible implementation.

### Natural Organization
Categories and tags arose organically from content rather than predefined taxonomy.

### Elegant Ruggedness
Single-file architecture is both beautiful and resilient - no broken dependencies, works anywhere.

## Recent Problem-Solving Approach

### Clear Filter Loop Issue
**Problem**: Clear filter button created infinite loops with URL-based routing
**Wu Wei Solution**: Stop fighting the system - disabled automatic URL filtering, made filters purely manual
**Learning**: Sometimes the most elegant solution is subtraction, not addition
**Result**: Clean, immediate filter clearing without complexity

## Easter Egg Implementation Decisions

### Matrix Rain Debugging Strategy
**Problem**: Matrix rain columns invisible during wu wei hover
**Root Cause**: CSS positioning conflict (columns starting at -200vh)
**Solution**: Systematic microtask breakdown - test static, then animation, then interaction
**Learning**: Visual effects need incremental verification to isolate issues

### Logo Glitch Design
**Decision**: Reality corruption aesthetic over simple color changes
**Implementation**: CSS filters (hue-rotate, contrast, brightness) + pixel displacement
**Text Morphing**: "phillip.clapham" → "root@void" → "undefined.undefined" → "system.error"
**Timing**: 5+ clicks in 2 seconds triggers, 2.5 second duration

### Morse Code Cursor Philosophy
**Decision**: Time-based switching between "stillness" (day) and "sleep" (night)
**Technical**: Custom keyframe animations with accurate morse timing
**Subtlety**: Extremely subtle - only rewards most attentive users
**Wu Wei**: Hidden depth beneath simple blinking cursor

### Easter Egg Integration Principle
**Philosophy**: Technical sophistication disguised as simplicity
**Implementation**: No cognitive overhead for non-explorers
**Discovery**: Natural user behavior triggers (hover, clicks, time awareness)
**Function**: Each serves delight without breaking site flow