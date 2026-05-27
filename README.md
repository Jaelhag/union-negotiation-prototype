# Union Negotiation System — Prototype

Clickable prototype of a contract negotiation management app built on top of Microsoft 365. Designed for labor negotiators and the attorneys who run them.

**Live demo:** https://jaelhag.github.io/union-negotiation-prototype/

## What this is

This is a single-page React app that runs entirely in the browser — no server, no database, no real Microsoft integration *yet*. Everything you see (proposals, sessions, files, emails) is demo data. You can click through every tab and feature to understand the workflow.

The data shows two example negotiations:
- **IBEW Local 1430 vs ConEd Westchester** — CBA renewal, 412 inside wiremen
- **NYRA CCTV Operators** — first contract, 47-member surveillance unit

## What's in it

Per-negotiation tabs: Overview, Articles (proposal tracker with AI-summarized back-and-forth), Files (9-folder template), Calendar, Caucus, Economics (live wage/benefit modeling), Team Chat, Proposal Review & Drafting (Claude-project model with standing instructions + per-proposal chats), and Communications (forward-to-email inbox).

## Stack

- React 18 (loaded from CDN)
- Babel Standalone (in-browser JSX compile — fine for a prototype, not for production)
- No build step. No npm. Open `index.html` in any modern browser.

## What this is NOT

This is a *design specification you can click through*. Buttons work, but nothing persists, no real Word docs open, no real Teams call connects, no actual Outlook email sends. Turning this into a real working app requires either (a) a SharePoint/Power Automate backbone with the UI ported to SPFx, or (b) a custom web app with Microsoft Graph integration. See sibling repo `union-negotiation-system-sharepoint` for the SharePoint backbone.

## Design origin

Originally designed in [Claude Design](https://claude.ai/design) and exported as a handoff bundle. Inspired by Clio's clean legal-SaaS aesthetic — original design, not a recreation of any branded UI.
