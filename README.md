# JackGPT Portfolio Site

React/Vite portfolio homepage for the JackGPT ecosystem. The site presents public services, guided recruiter paths, project writeups, screenshots, architecture notes, blog posts, and live status checks through a command-center style UI.

## Highlights

- React + Vite single-page app
- Project detail routes with screenshot galleries
- Cloudflare Pages Function for live endpoint status
- Guided Demo Mode for cold recruiter visits
- Architecture Map and public-safe engineering blog
- AI companion that explains where to start and what each project proves
- Public status integration with `status.jackgpt.org`
- Recruiter-friendly summaries for AI, Docker, finance, and infrastructure projects
- Responsive dark UI with polished service cards and status panels

## What Recruiters Should Inspect

- `src/App.jsx`: project data model, guided demo route, project drilldowns, companion UI, contact modal, status grid, and recruiter navigation.
- `functions/api/status/summary.js`: same-origin status aggregation that separates probe URLs from human-facing links.
- `functions/api/companion.js`: public-safe fallback context for the homepage AI guide.
- `public/project-images/`: sanitized screenshots used by the live project cards.
- `public/code-notes/`: public-safe architecture notes, including the private Ops Control Room case study.

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Safety Notes

- Public status checks hit public URLs only.
- No private credentials, tunnel secrets, databases, or local machine paths are included.
- Screenshots are sanitized where needed.
- Private controls such as Ops remain behind Cloudflare Access; this repo explains architecture without exposing administrative capabilities.
