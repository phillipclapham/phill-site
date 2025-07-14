# Next Steps

## Immediate Tasks

### 1. Fix Category Navigation Spacing

**Status**: DONE
**Issue**: Category nav items (All • Life Notes • Poetry • Politics) need proper spacing
**Solution**: CSS update for `.category-nav-item` with proper margins
**Priority**: Low (cosmetic)

### 2. Commit Current URL Fixes + Project Memory

**Status**: Ready
**Changes**: Hash-based routing, JavaScript cleanup, event propagation fixes, project memory structure
**Impact**: Resolves major functionality issues and establishes wu wei organization
**Priority**: High

## Bug Fixes Needed

### 3. Clear Filter Button Not Working

**Status**: FIXED
**Issue**: When filtering by category/tag, the "✕ clear" button didn't properly return to unfiltered archive
**Solution**: Disabled automatic URL-based filtering, made filters purely manual
**Root cause**: Infinite loop between URL routing and filter clearing
**Priority**: Medium (affects user experience)

### 4. URL Cleanup on Navigation

**Status**: Identified
**Issue**: When navigating away from blog pages, URL retains blog hash fragments
**Example**: Moving from `#blog?category=Poetry` to home should clear to `#home`, not stay on blog URL
**Impact**: Creates URL confusion and affects back/forward navigation
**Solution**: Reset hash when navigating to non-blog pages
**Priority**: Medium (affects URL clarity and navigation expectations)

## Potential Enhancements (Apply Six Cuts)

### RSS Feed Generation

**Consideration**: Auto-generate RSS feed during build
**Six Cuts Analysis**:

- Necessity: Moderate (some users prefer RSS)
- Efficiency: Would require additional build logic
- Friction: Adds complexity to build process
- Dependency: Creates another output file to manage
- Perception: RSS users would find valuable
- Emergence: Doesn't create meaningful connections with existing elements
**Decision**: Defer until clear demand

### Search Functionality

**Consideration**: Client-side search across blog posts
**Six Cuts Analysis**:

- Necessity: Low (only 3 posts currently)
- Efficiency: Would require search index generation
- Friction: Adds JavaScript complexity
- Dependency: Search index maintenance
- Perception: Not needed until more content
- Emergence: Could enhance discoverability later
**Decision**: Defer until content reaches critical mass

### Comment System

**Consideration**: Enable reader engagement
**Six Cuts Analysis**:

- Necessity: Questionable (blog serves transmission, not discussion)
- Efficiency: Would require external service or complex implementation
- Friction: Significant - moderation, spam, storage
- Dependency: External service dependency violates single-file principle
- Perception: May contradict wu wei aesthetic
- Emergence: Creates social connections but adds maintenance burden
**Decision**: Likely reject - conflicts with core principles

## Maintenance Considerations

### Content Workflow

**Current**: Add markdown file → run `npm run build` → commit
**Optimization potential**: Git hooks to auto-build on markdown changes
**Trade-off**: Convenience vs. simplicity

### Build Script Evolution

**Current**: Functional but could be more elegant
**Potential refactoring**: Extract functions, improve error handling
**Apply principle**: Only refactor if friction increases with content volume

## Wu Wei Evaluation

**What wants to emerge**: The site functions well as content delivery mechanism
**What resists natural flow**: Minor spacing issues, but nothing systemic
**Minimum viable intervention**: Fix spacing, commit fixes, observe usage patterns

## Success Metrics

1. **Functional elegance**: Blog system disappears into use
2. **Content flow**: Easy to add new posts without friction
3. **Reader experience**: Clear navigation, fast loading, shareable URLs
4. **Maintenance burden**: Minimal ongoing complexity

Current status: ✅ Achieved core functionality with elegant simplicity
