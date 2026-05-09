# JackGPT Portfolio Site

React/Vite portfolio homepage for the JackGPT ecosystem. The site presents public services, project writeups, screenshots, and live status checks through a command-center style UI.

## Highlights

- React + Vite single-page app
- Project detail routes with screenshot galleries
- Cloudflare Pages Function for live endpoint status
- Recruiter-friendly summaries for AI, Docker, finance, and infrastructure projects
- Responsive dark UI with polished service cards and status panels

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

