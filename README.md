# phillipclapham.com

Personal website for [Phillip Clapham](https://phillipclapham.com) — harness engineer, author of *A Structural Theory of Harnesses*, Senior Solutions Architect at Pressable, founder of Clapham Digital LLC.

## What This Is

The unified identity hub: harness engineering, AI agent infrastructure, technical writing, poetry, and political analysis. Single-page architecture with deeper pages for About, Lab, Writing, Poetry, and Connect.

**Live site:** [phillipclapham.com](https://phillipclapham.com)

## Architecture

- **Static HTML.** No build system. Each page is its own file.
- **Single shared stylesheet** (`protocol-memory.css` + `site-overrides.css`).
- **Hosted on GitHub Pages.** CNAME configured.
- **Plausible Analytics** for traffic (privacy-respecting, no cookies).

## Pages

- `index.html` — Home (hero + About preview + Work grid + Writing preview + Connect)
- `about.html` — Origin-style memoir (How I Got Here / Professional Work / Constraint-Driven Design / Engineering Philosophy / What I'm Building Now)
- `lab.html` — All projects (active + deployed + archived)
- `writing.html` — Featured essays + Nemo Operans publication
- `poetry.html` — Selected poems from *Mire & Moonlight*
- `connect.html` — All ways to find and reach me

## Visual Identity

- **Dark mode default** with light toggle (FOUC prevention inline)
- **Founder Mode** default-on with toggle to dial it down (inverted from typical "professional first" portfolios)
- **Cognitive pulse animation** on home (neural origin / Spectrum Core)
- **Game of Life footer** (emergence from simple rules)
- **3D card tilt + water ripple** subtle interaction effects
- **Console easter eggs** — open DevTools

## Tech

- HTML5 + CSS3 + vanilla JavaScript (no frameworks)
- Google Fonts: Inter, Michroma, Space Grotesk
- Plausible Analytics

## License

Content is © Phillip Clapham. Source code published for reference only.
