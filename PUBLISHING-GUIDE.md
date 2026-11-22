# Daily Feed for Market Intel — publishing guide

## Important: team-only access

This package is a static website. **Do not publish it publicly if the reports are intended for your team only.**

GitHub Pages sites are public by default, including sites built from private repositories. GitHub's private Pages access control requires GitHub Enterprise Cloud and an organization-owned repository. Check the current GitHub documentation before enabling Pages:
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site

If you do not have GitHub Enterprise Cloud, keep the repository private and use an authenticated hosting/access layer (for example, Cloudflare Access in front of a supported deployment) or choose a team knowledge platform with sign-in. Do not rely on an obscure URL or a JavaScript password prompt as security.

## Files

- `index.html` — dashboard homepage
- `assets/style.css` — research-portal styling
- `assets/app.js` — report archive and reader
- `reports.json` — index of published reports
- `templates/` — copy-ready morning and evening report templates
- `reports/` — add dated Markdown reports here

## Create the GitHub repository

1. Sign in at https://github.com.
2. Create a repository named `daily-feed-market-intel`.
3. Set repository visibility to **Private**.
4. Upload the contents of this ZIP (not the ZIP itself) to the repository root.
5. Commit the files.

## Hosting decision before deployment

### If your organisation has GitHub Enterprise Cloud
1. Use an organization-owned private repository.
2. Configure GitHub Pages from `main` and `/ (root)` or use the official Pages workflow.
3. In Settings → Pages, set site visibility to **Private**.
4. Confirm only intended team members have repository read access.
5. Test access using an account that is not in the team.

Private GitHub Pages access control is an Enterprise Cloud feature. A private repository alone does not make the published site private.

### If you do not have GitHub Enterprise Cloud
Do not enable ordinary public GitHub Pages for internal reports. Keep the repo private and arrange authenticated hosting/access control before publishing sensitive reports. Ask your IT administrator to configure an authenticated host. The static site files can be reused.

## Publishing a report manually

For each ChatGPT briefing:

1. Copy the complete report into a plain-text Markdown file.
2. Name it using this pattern:
   - `2026-11-22-morning.md`
   - `2026-11-22-evening.md`
3. Upload it into the `reports/` folder.
4. Open `reports.json` and add a matching entry.
5. Commit both files together.

Example `reports.json`:

```json
[
  {
    "id": "2026-11-22-morning",
    "date": "2026-11-22",
    "type": "morning",
    "title": "Morning Market Intelligence — 22 Nov 2026",
    "summary": "Overnight global cues, India pre-market developments and four-instrument outlook.",
    "file": "reports/2026-11-22-morning.md"
  },
  {
    "id": "2026-11-22-evening",
    "date": "2026-11-22",
    "type": "evening",
    "title": "Evening Market Debrief — 22 Nov 2026",
    "summary": "Indian market review, after-close developments and next-session scenarios.",
    "file": "reports/2026-11-22-evening.md"
  }
]
```

Important:
- `reports.json` must be valid JSON. Use double quotes and do not add a comma after the last item.
- Use unique `id` values.
- `type` must be `morning` or `evening`.
- Keep the report's source links as full `https://` URLs.
- Do not put confidential client data, account details, personal information or proprietary positions in public reports.
- The report viewer uses the Marked library from jsDelivr to render Markdown. Readers need an internet connection for this script.

## Updating the website

Every commit to the configured publishing source triggers a new deployment. On GitHub, check the Actions tab for the deployment status. A normal update can take several minutes to appear.

## Suggested daily operating process

- 08:30 IST: ChatGPT creates the morning report.
- After review: save as `YYYY-MM-DD-morning.md`, update `reports.json`, commit.
- 21:30 IST: ChatGPT creates the evening report.
- After review: save as `YYYY-MM-DD-evening.md`, update `reports.json`, commit.
- Weekly: review older reports and update the strategic watchlist.

## Data quality and investment disclaimer

Check publication timestamps and market-data timestamps. Mark provisional flows and preliminary figures clearly. Never present a forecast as a certainty. This site is a research aid, not investment advice.
