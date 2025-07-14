# Personal Website with Blog System

## Project Essence
Single-file HTML website embodying wu wei principles and energetic economy, featuring a functional blog system built with minimal interference.

## Core Philosophy
Every element must justify its energy through utility, friction reduction, or function amplification. The site whispers its function while remaining perfectly understood.

## Architecture
- **Single-file structure**: All content in `index.html` with embedded CSS/JS
- **Terminal aesthetic**: Dark theme, IBM Plex Mono, amber/green accents
- **Hash-based routing**: GitHub Pages compatible URLs (`#blog`, `#blog-post-slug`)
- **Build system**: Node.js processes markdown with YAML frontmatter
- **No external dependencies**: Self-contained except Google Fonts

## Current State
- ✅ Core website with 6 main sections (home, about, philosophy, wu wei, experience, contact)
- ✅ Blog system with markdown processing and YAML frontmatter
- ✅ Category navigation (All • Life Notes • Poetry • Politics)
- ✅ Tag/category filtering with URL parameters
- ✅ Hash-based routing for GitHub Pages compatibility
- ✅ Event propagation fixes for filtering
- 🔧 Minor spacing issue in category navigation

## Technical Stack
- **Frontend**: Pure HTML/CSS/JS (no frameworks)
- **Build**: Node.js with marked + gray-matter
- **Posts**: Markdown files in `/posts` directory
- **Hosting**: GitHub Pages
- **Domain**: phillipclapham.com

## Design Principles Applied
- Function is sovereign - blog system serves content delivery without ornament
- Invisible is ideal - navigation and filtering feel natural
- Compression is power - single-file architecture eliminates dependencies
- Elegance emerges - terminal aesthetic arises from functional clarity

## Wu Wei Implementation
Solutions emerged through precise non-interference rather than forced complexity. The blog system wanted to be simple - markdown files processed into embedded HTML with minimal client-side routing.