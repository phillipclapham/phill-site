# Public Estate Audit + Redesign Brief

**Created:** 2026-07-19
**Supersedes:** `SITE_REDESIGN_PLAN.md` (Feb 4, 2026 — that plan was executed; this replaces it)
**Scope:** phillipclapham.com, nemooperans.com, claphamdigital.com, flowscript.org, levainhq.com, GitHub, PyPI, Zenodo
**Source:** three parallel audits, 2026-07-19, all findings verified against live oracles (PyPI JSON API, GitHub REST API, Zenodo API, DNS, the test suite on disk)

---

## The one-sentence finding

**The estate has no spine.** Four properties, four visual identities, four name forms, four theme postures, four accent colors — and two of them run on stylesheets lifted from other projects with the donor headers still in place.

The committed positioning says *one identity spine projected per-surface*. What exists is four surfaces and no spine.

---

## 1. The structural leak (fix this first, it's not cosmetic)

**The DEPTH pillar has no path to the CREDIBILITY pillar.**

The flagship credential — *A Structural Theory of Harnesses*, the thing that makes "the person who named the discipline" true — is hosted on nemooperans.com, a publication whose About page is written in the AI's first person and says almost nothing about who Phill is. Its only human-identity pointer is a small link to phillipclapham.com.

Until 2026-07-19 that link landed on a false present-tense employment claim.

So the path was: read the paper → want to know who wrote it → arrive at a lie. An enterprise reader could not get from the harness thesis to "this is a real infrastructure engineer" without passing through a stale fact. The destination is now fixed; the *path* still needs designing.

**Same leak, other direction:** claphamdigital.com links to nothing. No founder name anywhere on the property. Someone who lands there cannot discover the same person wrote the paper.

---

## 2. What's already fixed (2026-07-19)

| Fix | Detail |
|---|---|
| Pressable employment | Was false in 5 places on phillipclapham.com + the public README. Now founder-primary; Pressable retained in **past tense** as the credibility pillar. |
| `govern-not-trust` | The word "governed" appeared **zero times** across the entire estate outside LinkedIn. Now on the homepage and the About short-version. |
| anneal-memory version | Site said v0.3.3. PyPI says **0.9.6**. Corrected. |
| Levain version | Site said v0.2.0. PyPI says **0.3.13**. Corrected. |
| Test count | Site said "783 tests passing" in 4 places. Suite actually runs **1,642 passed in 16.76s**. Written as "1,600+" so it degrades instead of re-rotting. |

`12 framework integrations` was verified correct and left alone.

---

## 3. Open findings, ranked by damage

### Tier 1 — actively costing credibility

1. **`levainhq.com` does not resolve.** Registered, Cloudflare nameservers assigned, no A/AAAA record. Dead in three places on the ONE public bet: the GitHub repo homepage field, the **PyPI sidebar's first link**, and the README footer. This is the highest-intent traffic in the portfolio — developers who already decided to evaluate Levain.
2. **GitHub profile still claims Pressable in three places:** the `bio` field, the `company` field (renders as a linked org badge under the avatar), and a full paragraph in the profile README.
3. **flowscript.org's metadata sells a live product its own body calls superseded.** The meta/OG description advertises "Nine framework adapters. Open source." The page body says *"FlowScript **was** a deep exploration… The concepts proved themselves and **evolved**."* Search results and social unfurls market something the page then retracts.
4. **No `og:image` on any property.** phillipclapham.com declares `twitter:card = summary_large_image` with no image — renders as a broken card. Every share of the harness paper is a bare text link.

### Tier 2 — self-contradiction across surfaces

5. **anneal-memory is "two-layer" on flowscript.org, "four-layer" everywhere else.** He misdescribes his own flagship, and a visitor comparing two of his sites catches it.
6. **FlowScript is "nine adapters" on flowscript.org and "11 adapters" on phillipclapham.com.** Tests are "~1,400" vs "779 TS + 717 Py" (=1,496).
7. **Four name forms:** Phillip Clapham / Phill Clapham / Clapham, Phillip (Zenodo) / none (claphamdigital). Four contact addresses. PyPI maintainer handle `pclapham42`, unconnected to anything.
8. **Four footer taglines** for one claim: "Building things that work since 1996" / "Making impossible possible since 1996" / "I build systems that work" / "Apps that work. Built with play."
9. **Two Bluesky identities** linked from two different pages, never reconciled.

### Tier 3 — positioning register

10. **Credential-defensive constructions accept the frame they're trying to escape.** "No CS degree" ×2, "Self-taught" ×2, "4,000+ GitHub contributions" ×2. Someone who named a discipline and holds a Zenodo DOI does not preemptively concede a missing degree. **Delete, don't soften.**
11. **The best sentence on the site is buried.** `about.html` §02: *"The harness paper named the discipline. The work was already there."* That is the spine, stated perfectly, in paragraph 2 of an interior section. The hero says *"I build systems that work"* — a line that could belong to any engineer alive.
12. **"The Professional Work" is the section title for the Pressable narrative** — encoding *employment = professional, everything else = hobby*. Exactly inverted from the founder-primary lean.
13. **Levain, the flagship, is card #3-of-5 and #5-of-6.** Nothing on the site is marked as the flagship *product*. Its GitHub was pushed the same day this audit ran — the most active repo in the portfolio is presented as a minor item.
14. **permit-leads and Wisp do not exist on the site.** The most legible "I ship real businesses" proof on the runway is invisible.

### Tier 4 — architecture and IA

15. **`protocol-memory.css` (65KB) is the foundation stylesheet.** Its header reads `Protocol Memory Showcase Site`. That product is listed as Archived on this site's own `/lab` page. `site-overrides.css` (35KB) exists solely to fight it. `theme-color #4B6BFB` is the dead product's brand blue.
16. **Palette is Tailwind's defaults**, hand-copied into CSS custom properties so they read as bespoke. Same on claphamdigital.com.
17. **`poetry.html` is fully orphaned** — zero inbound links from any page, nav, or footer. Reachable only by typing the URL. Root cause: **the depth pages have no cross-navigation at all**, only a back-to-home link. That's why it could vanish unnoticed.
18. **~70% of the depth pages are verbatim homepage restatement.** The anneal paragraph appears 4×, the harness paper description 5×, Nemo Operans 4×. Lab/Writing/Connect add genuinely new information in roughly six places total.
19. **No audience routing exists.** Nav is organized by content type (About/Work/Writing/Connect) — the axis that guarantees mush when four audiences want four different things. The homepage About block introduces **seven identities in seven lines**.

### Tier 5 — evidence

20. **Zero images site-wide.** No screenshots, no diagrams, no code samples, no demos, no photograph of Phill. A site whose thesis is *ships in public* shows nothing. 26 specific spots where prose describes something that should be shown are catalogued in the audit.

---

## 4. What's genuinely good (keep it)

- **nemooperans.com is the only property with a stated and honored design position.** Chosen palette (`#C9A961` gold rationalized as kintsugi), 18px body copy, a dedicated reading measure, 11KB of hand-written CSS, no build step. It reads as designed rather than assembled. *Weakness: 37 essays flat-ranked, so the flagship paper has no visual privilege — no "start here," no featured slot.*
- **The flowscript.org playground is the best artifact Phill has published on the open web.** A live CodeMirror editor with a client-side Ohm.js parser and D3 graph rendering. It lets you *do the thing* instead of reading about it. *Weakness: 884KB bundle, zero server-rendered content — the one property that should be quotable by AI systems is invisible to them.*
- **claphamdigital.com's copy is the most confident writing in the estate** after the essays. "Sports bettors grok +EV. The pit hasn't caught up." "Mathematically verified to 0.004% precision." *Weakness: rendered next to a slot-machine emoji where a real app icon should be.*
- **phillipclapham.com's interaction layer is real craft** — Conway's Life in the footer, 3D card tilt, the inverted founder-mode toggle whose own code comment is the best line in the repo: *"Subverts expectations: toggle turns things DOWN, not up."*
- **Zenodo is clean.** `Independent Researcher`, ORCID attached, no stale affiliation. The permanent citable record needs nothing.
- **"AI Governance" as a keyword appears on zero surfaces.** The avoidance discipline is intact.

---

## 5. The design brief

### The verdict to design against

> Top-notch garnish on a dead foundation.

Delightful toys bolted onto an archived product's stylesheet and a default palette. The gimmicks read as personality; the underlying system reads as unowned. **This site does not currently look like it was made by someone whose product is architecture.**

### Principle 1 — Evidence density over decoration

The highest-leverage change available is going from a site that *describes* the work to one that *demonstrates* it. That is what signals extreme attention to detail. Prettier gradients do not.

Priority assets, in build order (each serves more than one surface):

1. **The four-layer architecture diagram** (episodic / continuity / Hebbian / affective + the cross-cutting immune system). The paper's central claim, currently a sentence taken on faith. Highest-value missing asset in the estate.
2. **A real hash-chained JSONL excerpt**, 3–4 lines with hashes visible. Nothing proves "verifiable" like showing the chain.
3. **An asciinema recording of `levain init`.** The flagship's onboarding interview is a demoable thing with no way to see it run.
4. **The Levain → anneal-memory → harness stack diagram.** The two flagship OSS projects' relationship is stated once and never drawn.
5. **iOS screenshots** for flowConnect and the Clapham Digital apps. Real store assets already exist; emoji currently stand in.
6. **permit-leads output** — a redacted Tier-2 market-analysis PDF, the 148-lead digest.
7. **A Wisp gameplay GIF.** The one asset that would make the site move.
8. **A photograph of Phill.** Zero images of any kind currently, including the author. On a founder-primary site that's a trust gap.

### Principle 2 — Structural invariants over remembered updates

The version numbers rotted twice. **Replace every hand-typed version and test count with self-updating PyPI/CI badges.** An invariant beats remembering. Same reasoning as the rest of the apparatus: discipline drifts, structure refuses.

### Principle 3 — One design system, all surfaces

Collapse `protocol-memory.css` + `site-overrides.css` into a single owned system. Not a third override layer — a replacement. Then extend the same system to `levainhq.com`.

Personal site = the person. levainhq = the product. Visually unmistakably kin.

This makes "one identity spine projected per-surface" **visually true** rather than merely asserted — and consistency-across-surfaces is the named compoundability signature. It's the one measurable thing.

Requirements:
- A chosen palette. Not Tailwind's defaults laundered through custom properties.
- A real typographic scale with hierarchy contrast. Michroma currently does all the identity work alone.
- Kill the centered body prose. Long centered paragraphs are a taste tell.
- Fix the gradient wash — it drifts purple→green diagonally mid-grid, which reads accidental.
- Give the cards rhythm. anneal's card is 4× the length of Clapham Digital's; the grid is ragged.

### Principle 4 — Route the four audiences explicitly

The real IA brief. Employers, clients/customers, harness-research readers, and movement readers all land on one surface. Content-type nav guarantees mush.

Founder+author leads. Employers and clients each need a clean, obvious path that doesn't dilute the lead. Solve it structurally — not with a "Hire Me" button bolted to a résumé.

Also: **give the depth pages cross-navigation.** The absence is what orphaned poetry.html.

---

## 6. Sequenced plan

**Phase 0 — Stop the bleed** ✅ *done 2026-07-19, PR #1*
Pressable correction, spine propagation, version/test numbers.

**Phase 0b — Immediate, outside this repo**
- Point `levainhq.com` at the Levain repo via a Cloudflare redirect. Not a "coming soon" placeholder — that reads as abandoned, which is worse than a 404.
- GitHub profile: `bio`, `company`, and profile README. *Requires Phill — account settings.*
- Re-pin GitHub repos. Slot 1 is currently an archived repo; slot 2 is the ex-employer's platform tooling. Of six slots, one is a current on-spine artifact.
- Add topics to the Levain repo (currently zero — near-zero discoverability). Fill in the blank `levainhq` org profile.

**Phase 1 — The design system**
Build it standalone: tokens, palette, type scale, components. Owned, not inherited.

**Phase 2 — Rebuild phillipclapham.com on it**
Founder+author lead. Audience routing. Deduplicate the ~70%. Hero carries the spine. Evidence assets land.

**Phase 3 — Build levainhq.com on the same system**
The real product site. Shares the DNA and the evidence assets built in Phase 1–2.

**Phase 4 — Reconcile the rest of the estate**
flowscript.org metadata honesty + an "archived" badge + the npm/PyPI install names. claphamdigital.com founder attribution and app icons. nemooperans.com featured-paper slot. Name/tagline canonicalization. `og:image` everywhere.

---

## 7. Open questions for Phill

1. **The Pressable interview one-liner.** Leaning corporate-safe. Draft: *"The role ended in July. I'd been building the independent work on the side for a while, so I moved the timeline up and went full-time on it."* Never goes on-profile; interviews only.
2. **"Built by a neurodivergent"** is the sole identity claim on claphamdigital.com and appears on no other surface. Load-bearing or not? If yes, it's missing everywhere else. If no, it shouldn't be the only identity line on a whole property.
3. **The gambling-adjacent product line vs enterprise harness positioning.** A real, currently unmanaged tension — an evaluator following the trail from the paper lands on card-counting training. Defensible via deliberate-practice framing, but nothing on any property does the defending.
4. **`about.html` §03 discloses energy constraints** without naming MCAS. Currently the third-most-prominent section on the About page. Keep, reframe, or move?
