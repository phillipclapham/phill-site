# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Phillip Clapham's personal/professional website - a single-page HTML application with embedded CSS and JavaScript. The site showcases his work as a Technical Account Manager at Pressable and reflects his philosophy of "energetic economy" and wu wei principles.

## Architecture

**Single-file structure**: The entire website is contained in `phillip_site.html` with no external dependencies except Google Fonts.

**Navigation system**: Client-side routing using vanilla JavaScript that shows/hides page sections based on nav clicks. All pages exist as hidden divs that are toggled with the `.active` class.

**Theming**: CSS custom properties (variables) define the dark terminal aesthetic with consistent color tokens:
- `--bg-primary/#0a0a0a` and `--bg-secondary/#111111` for backgrounds
- `--accent-green/#00ff41` and `--accent-amber/#ffb000` for highlights
- `--text-primary`, `--text-secondary`, `--text-dim` for content hierarchy

## Key Implementation Details

**Page system**: Each content section is a `.page` div that's hidden by default. JavaScript adds/removes `.active` class for navigation.

**Responsive design**: Mobile-first approach with flexbox/grid layouts that adapt to screen size.

**Typography**: IBM Plex Mono provides the monospace terminal aesthetic throughout.

## Development Workflow

**No build process**: Edit `phillip_site.html` directly - it's production-ready as-is.

**Testing**: Open the HTML file in any modern browser to test changes.

**Deployment**: Upload the single HTML file to any web server.

## Content Philosophy

The site embodies Phillip's "Principle of Energetic Economy" - every element must justify its energy through utility, friction reduction, or function amplification. When making changes:

- Apply the "Six Cuts" evaluation: necessity, efficiency, friction, dependency, perception, emergence
- Maintain the terminal/hacker aesthetic with dark theme and monospace font
- Preserve the wu wei philosophy messaging throughout content
- Keep the single-file simplicity - don't introduce external dependencies unless absolutely necessary

## Technical Constraints

**No external dependencies**: The site intentionally avoids frameworks, build tools, or complex dependencies.

**Single-file architecture**: All CSS and JavaScript are embedded to maintain the self-contained nature.

**Progressive enhancement**: Core content is accessible even without JavaScript.

## Poetry Formatting

**Preserving line breaks**: The site uses `white-space: pre-wrap` CSS to preserve poetry formatting. To prevent Prettier from flattening line breaks:

1. **Main solution**: `.prettierignore` file excludes `index.html` from Prettier formatting
2. **Backup solution**: Poetry sections are wrapped with `<!-- prettier-ignore-start -->` and `<!-- prettier-ignore-end -->` comments
3. **When adding new poems**: Write line breaks directly in the HTML within `<div class="poem">` tags