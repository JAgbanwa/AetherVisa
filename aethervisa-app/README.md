# AetherVisa

> Navigate the European immigration system with confidence.

AetherVisa is a full-featured web application that helps immigrants, international students, researchers, and skilled workers plan and execute their move to Europe. It covers visa eligibility checking, side-by-side pathway comparison, document generation, cost estimation, university outreach, risk analysis, and community Q&A — all in one dark-themed, mobile-friendly interface.

## Features

| Page | What it does |
|---|---|
| **Eligibility Checker** | 4-step profile form → probability estimates for 9 EU visa pathways |
| **Visa Comparison** | Browse all pathways; compare up to 4 side-by-side in a full-width diff table |
| **Document Generator** | 5 editable templates (cover letters, motivation letters, hosting agreements, appeal letters) with live preview, copy & download |
| **Cost & Timeline Estimator** | Per-pathway cost breakdowns with visual bar charts and processing phase timelines |
| **University Outreach Tool** | Searchable database of 10 EU universities; auto-generates personalised outreach emails; tracks reply status |
| **Risk & Red Flag Analyzer** | Situational self-assessment quiz that surfaces critical, warning, and informational flags |
| **Community Forum** | Post questions, upvote answers, filter by country and category |
| **Pricing** | Free / Premium (€9–14/month) / Expert Review (€199 one-time) with billing toggle and FAQ |

## Tech Stack

- **Vite 8** + **React 18** + **TypeScript**
- **Tailwind CSS v3** with a custom dark design system (`slate-950` base, blue/cyan gradient accents)
- **React Router DOM** for client-side navigation
- **Lucide React** for icons
- **clsx** for conditional class composition

## Project Structure

```
aethervisa-app/
├── src/
│   ├── types/          # TypeScript interfaces (VisaOption, UserProfile, etc.)
│   ├── data/           # Static data (9 visa options, 10 universities, red flags)
│   ├── hooks/          # useEligibility — scoring logic for all pathways
│   ├── components/     # Navbar, Footer
│   ├── pages/          # One file per route (8 feature pages + HomePage)
│   ├── App.tsx         # BrowserRouter + Routes
│   ├── main.tsx        # Entry point
│   └── index.css       # Tailwind directives + custom component classes
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Getting Started

```bash
# Install dependencies
cd aethervisa-app
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Production build
npm run build
```

## Visa Pathways Covered

| Country | Visa |
|---|---|
| 🇪🇸 Spain | Researcher Visa (Art. 13), Student Visa |
| 🇩🇪 Germany | Job Seeker Visa, EU Blue Card |
| 🇳🇱 Netherlands | Highly Skilled Migrant (HSM), Orientation Year |
| 🇮🇹 Italy | Talent Visa |
| 🇧🇪 Belgium | Researcher Visa |
| 🇵🇹 Portugal | D3 Highly Qualified Activity Visa |

## Business Model

- **Free** — Basic eligibility checker, visa comparison, 2 document templates, risk analyzer
- **Premium** — €9/month (annual) or €14/month — full probability breakdowns, all templates, outreach tracker, personalised plans
- **Expert Review** — €199 one-time — 60-min consultant video call, document review, follow-up Q&A

## Legal Disclaimer

AetherVisa provides general information and tools only. It is **not** legal advice and does not constitute legal representation. Always consult a qualified immigration lawyer for complex situations.
