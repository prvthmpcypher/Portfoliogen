# PortfolioGen — by Cypher Labs
![Built with: Vanilla JS](https://img.shields.io/badge/built%20with-Vanilla%20JS-yellow)
![Status: Live](https://img.shields.io/badge/status-live-brightgreen)
![No frameworks](https://img.shields.io/badge/frameworks-zero-blue)

> A privacy-first, browser-only portfolio generator. Fill in a wizard, drag your blocks, download your ZIP. No account. No server. No lock-in.

---

## The Problem

Most portfolio builders either:
- Cost money after a trial
- Lock your content into their platform
- Require you to know how to code or configure a server
- Send your personal data to third-party servers

## The Solution

PortfolioGen runs entirely in your browser. You enter your details, choose your layout, pick a theme, and download a ZIP file containing your full portfolio — clean HTML, CSS, and assets. Host it anywhere. Open it offline. You own the files forever.

---

## Features

| Feature | Description |
|---------|-------------|
| 🧩 Bento block builder | Drag-and-drop layout using resizable content blocks |
| 📦 ZIP download | Full HTML + CSS + assets package, no server required |
| 🌙 Dark mode | Built into every theme via CSS custom properties |
| 📱 Mobile responsive | 2-breakpoint system (980px, 760px) |
| 🔒 Privacy-first | No data leaves your device (except optional GitHub Feed block) |
| 🎨 5 themes | Distinct visual themes, all with dark mode support |
| 🆓 Free & open source | No account required, MIT licensed |

---

## Block Library

| Block | Description |
|-------|-------------|
| Hero | Name, title, CTA buttons |
| Bio | About text and profile photo |
| Skills Grid | Skill bars with percentage levels |
| Projects | Card grid with image, category, description, links |
| Education | Degree/course timeline |
| Social Links | All social profiles in one panel |
| Contact Form | Email form with direct contact link |
| GitHub Feed | Live commit feed via GitHub public API |
| Image Gallery | Photo grid |
| Testimonials | Quote cards |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | Vanilla HTML5 + CSS3 |
| Logic | Vanilla JavaScript (ES5/ES6, no transpiler) |
| Design tokens | CSS Custom Properties |
| ZIP generation | JSZip 3.10.1 |
| File download | FileSaver.js 2.0.5 |
| Icons | Boxicons 2.0.5 (CDN) |
| Build system | None — open `index.html` and go |

---

## How It Works

```
User fills wizard
       │
       ▼
  schema (JSON)
  collected in memory
       │
       ▼
builder.js generates
  HTML + CSS strings
       │
       ▼
  JSZip bundles
  all files + assets
       │
       ▼
FileSaver triggers
  browser download
       │
       ▼
  User has ZIP
  (self-contained portfolio)
```

---

## Who It's For

| User | Use case |
|------|----------|
| Students & freshers | First portfolio before applying for internships/jobs |
| Designers | Visual portfolio without touching code |
| Freelancers | Quick client-facing page with no hosting overhead |
| Developers | Starter template to customise and extend |
| Privacy-conscious users | Portfolio builder that doesn't touch a server |

---

## File Structure

```
PortfolioGen/
├── index.html          ← Landing page
├── generate.html       ← Portfolio generator (wizard)
├── templates.html      ← Template previews
├── about.html          ← About Cypher Labs
├── contact.html        ← Feedback and contact
├── work.html           ← Docs + legal pages
└── assets/
    ├── css/
    │   └── styles.css      ← Full design system
    ├── js/
    │   ├── main.js          ← Theme toggle, nav, UI
    │   ├── wizard.js        ← Multi-step form logic
    │   └── builder.js       ← HTML/CSS code generator
    └── img/
        ├── svg/             ← Logo files
        └── *.png            ← Sample/template preview images
```

---

## Pricing

| Plan | Cost | Limits |
|------|------|--------|
| Free | $0 | Unlimited — all features, all templates |

PortfolioGen is and will remain free.

---

## Roadmap

- [ ] Fix GitHub Feed XSS in generated output (v1.0.1)
- [ ] Add meta descriptions and OG tags to all pages
- [ ] Add `generate.html` footer
- [ ] Add SRI to all CDN resources
- [ ] Compress and WebP-convert template preview images
- [ ] Add `robots.txt` and `sitemap.xml`
- [ ] Replace placeholder testimonials with real beta feedback
- [ ] Add more blocks: Spotify Now Playing, Blog RSS, Timeline
- [ ] Add PDF export option
- [ ] Add custom domain connection guide

---

## Contributing

Issues and PRs are welcome. If you find a bug or want to add a block:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-block`)
3. Make your changes and test locally by opening `index.html`
4. Submit a PR with a clear description

No build step. No node_modules. Just open, edit, and test in a browser.

---

## Legal

- [Privacy Policy](https://[your-domain]/work.html#privacy)
- [Terms of Service](https://[your-domain]/work.html#terms)
- [Cookie Notice](https://[your-domain]/work.html#cookies)
- [Community Guidelines](https://[your-domain]/work.html#community)

---

## Connect

[![GitHub](https://img.shields.io/badge/GitHub-prvthmpcypher-black?logo=github)](https://github.com/prvthmpcypher)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-prvthmp-blue?logo=linkedin)](https://www.linkedin.com/in/prvthmp)
[![X](https://img.shields.io/badge/X-prvthmp-black?logo=x)](https://x.com/prvthmp)
[![Instagram](https://img.shields.io/badge/Instagram-prvthmp-pink?logo=instagram)](https://www.instagram.com/prvthmp)

---

Made by [Poorvith M P](https://github.com/prvthmpcypher) · Cypher Labs · 2026
