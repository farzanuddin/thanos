# thanos-sort — Svelte demo

Lightweight visualization of the ThanosSort gimmick.

Run locally:

```bash
npm install
npm run dev
```

Open http://localhost:5173 (or the port shown by Vite) in your browser. Use the controls to generate arrays and press Snap/Step to see half of the items removed each iteration until the remainder is sorted.

Publishing to GitHub Pages
--------------------------

This repo includes a GitHub Actions workflow that builds the app and publishes the `dist/` output to GitHub Pages using the `peaceiris/actions-gh-pages` action. The workflow runs automatically on pushes to the `main` branch.

To create a repository on GitHub and push this project (options):

1) If you have the GitHub CLI (`gh`) installed and authenticated:

```bash
gh repo create <USERNAME>/<REPO> --public --source=. --remote=origin --push
```

2) Or create the repository on github.com, then run locally:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:<USERNAME>/<REPO>.git
git branch -M main
git push -u origin main
```

After pushing to `main`, the GitHub Actions workflow will run, build the site and publish the `dist/` directory to the `gh-pages` branch. GitHub Pages will serve the site from that branch — check the repository Settings → Pages if you need to adjust the publishing source or enforce HTTPS.

Notes
- If you prefer to publish from the `docs/` folder on `main` instead of `gh-pages`, you can change Vite's build output or the Actions workflow accordingly.
- If your org requires a deploy key instead of the default `GITHUB_TOKEN`, update the workflow to use the appropriate secret.

