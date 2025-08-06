# Single-Page Redesign Plan

## Overview
Transform the current hash-routed multi-page site into a true single-page site with anchor navigation for better SEO and simplicity. Replace journal system with external Substack link.

## Current Architecture Issues
- Hash-based routing (#home, #poetry) prevents proper SEO indexing
- Hidden content (display: none) may not be crawled effectively
- JavaScript-loaded journal posts have no indexable URLs
- Complex build system for minimal benefit

## New Architecture
- Single HTML page with all content visible in DOM
- Anchor links (#about, #poetry) for smooth scrolling to sections
- No JavaScript routing - pure HTML/CSS with minimal JS for effects
- All content immediately indexable by search engines

## Implementation Steps

### 1. Structure Changes
- Remove all `.page` divs with display:none
- Convert to semantic sections with IDs for anchor navigation
- Stack sections vertically in natural reading order

### 2. Navigation Updates
- Change nav links from hash routing to anchor links
- Implement smooth scrolling (optional, CSS or minimal JS)
- Remove active state management (no longer needed)
- Consider sticky navigation for better UX

### 3. Content Curation
- **Poetry Section**: Select ~10 best poems as "selected poetry"
- **Journal**: Replace with single link to https://phillipclapham.substack.com/
- **Other sections**: Maintain current content but ensure visibility

### 4. Technical Cleanup
- Remove all JavaScript routing functions
- Remove URLSearchParams handling
- Remove page state management
- Delete build.js and /posts directory
- Keep only essential JavaScript (if any)

### 5. CSS Simplification
- Remove `.page` and `.active` styles
- Add section spacing/padding for vertical layout
- Ensure responsive design works for single-page flow
- Consider adding subtle section dividers

## Poetry Selection Criteria
From the 18 poems (i-xviii), select based on:
1. Thematic diversity
2. Emotional range
3. Technical variety
4. Reader accessibility
5. Personal significance

Suggested selections (can be adjusted):
- i. "rain washed away the road home" - opening, gentle
- iii. "gravity" - unique physics/poetry blend
- v. "there you are" - simple, profound
- viii. "look for me where they bury the poets" - memorable imagery
- x. "to find me" - distinctive voice
- xi. "bees in my brain" - strong metaphor
- xiv. "lost" - existential depth
- xv. "low hymn" - beautiful imagery
- xvii. "poetry makes nothing happen" - meta-commentary
- xviii. "wind and lightning bringing fire" - powerful closing

## Benefits of Redesign
1. **SEO**: All content visible and indexable
2. **Performance**: No JavaScript routing overhead
3. **Simplicity**: Easier to maintain and update
4. **User Experience**: Faster, more predictable navigation
5. **Wu Wei**: Removing complexity to reveal essential function

## Navigation Structure
```
home (hero/intro)
  ↓
selected poetry (10 curated poems)
  ↓
about (brief bio)
  ↓
philosophy (contemplative approach)
  ↓
journal → external link to Substack
  ↓
contact (connection info)
```

## Technical Notes
- Backup current index.html before changes
- Test anchor scrolling behavior across browsers
- Ensure mobile navigation works smoothly
- Consider print stylesheet for clean output
- Verify all external links (Substack, etc.)

## Post-Implementation
- Update CLAUDE.md to reflect new architecture
- Update projectbrief.md with completed redesign
- Remove obsolete build-related files
- Test thoroughly on mobile and desktop
- Verify SEO improvements with testing tools