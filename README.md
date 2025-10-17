# phillipclapham.com

**Live Protocol Memory Showcase** - Personal website powered by [Protocol Memory](https://github.com/phillipclapham/protocol-memory) integration library.

## What This Is

This site serves as the reference implementation and live showcase of Protocol Memory's site integration capabilities. It demonstrates how any Protocol Memory user can power their personal website with real-time data from their Protocol Memory public profile.

**Live Site:** [phillipclapham.com](https://phillipclapham.com)

## How It Works

- **Dynamic Content**: Site content auto-updates from Protocol Memory public profile
- **Zero Backend**: Pure client-side integration using `protocol-integration.js`
- **Auto-Refresh**: Fresh data every 5 minutes
- **Graceful Fallback**: Falls back to static HTML when API unavailable

## Architecture

This repo is a **deployment artifact** managed by the [protocol-memory](https://github.com/phillipclapham/protocol-memory) project:

- **Source Library**: `/js/protocol-integration.js` in protocol-memory repo
- **Documentation**: All project docs in protocol-memory repo
- **Development**: All changes tracked in protocol-memory project memory

## For Developers

Interested in powering your site with Protocol Memory?

### Quick Start

**Via CDN** (Recommended):
```html
<!-- Protocol Memory Integration Library -->
<script src="https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-integration.js"></script>

<!-- Optional: Protocol Memory CSS Styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-memory.css">

<script>
  // Initialize with your Protocol Memory username
  const integration = new ProtocolIntegration('your-username');
  integration.init();
</script>
```

**Or Self-Host**:
1. Download from [GitHub Releases](https://github.com/phillipclapham/protocol-memory-integration/releases)
2. Include in your HTML
3. Initialize with your username

### Documentation

- **[Integration Guide](https://github.com/phillipclapham/protocol-memory-integration/blob/main/README.md)** - Complete usage docs
- **[Library Hosting](https://github.com/phillipclapham/protocol-memory-integration/blob/main/LIBRARY_HOSTING.md)** - Distribution & versioning

### Features

- Auto-refresh every 5 minutes
- Gravatar profile pictures
- Current state, about, projects, expertise
- Graceful fallback to static content
- Zero dependencies

---

**Project Management:** This repo is managed from [protocol-memory](https://github.com/phillipclapham/protocol-memory)
**Protocol Memory:** Building the missing layer between humans and AI
