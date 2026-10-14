# Run Locally and Deploy (GitHub + Vercel)

## 1. What you need

- **Node.js 18 or newer** (20/22 LTS recommended). Check with `node -v`.
- **npm** (comes with Node). Check with `npm -v`.
- **Git**.

---

## 2. Run it on your computer

### Quick way (one click)

- **VS Code:** open the project folder, go to **Run and Debug** (or press `F5`), pick **Run RIT Notebook**, and click ▶.
- **Terminal:** run `./run.sh`.

`run.sh` does everything for you. It checks Node.js (and installs it with Homebrew if it's missing), runs `npm install` when needed, starts the dev server and opens the site in your browser. Press `Ctrl+C` to stop.

You don't need anything else: the site has no backend, database, API keys or `.env` file. Notes and question papers are just Google Drive links.

### Manual way

```bash
# 1. Get the code
git clone https://github.com/harsha2511/RIT-Notebook.git
cd RIT-Notebook

# 2. Install packages (only needed once, or after package.json changes)
npm install

# 3. Start the dev server
npm run dev
```

Open the link it prints (usually **http://localhost:5173**). Saved changes show up instantly.

### All commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Starts the dev server with live reload |
| `npm run build` | Makes the production build in `dist/` |
| `npm run preview` | Serves `dist/` locally to test the real build (usually http://localhost:4173) |

> Always run `npm run build` once before pushing. If it fails here, it will also fail on Vercel.

### Common problems

| Problem | Fix |
|---------|-----|
| `vite: command not found` | You skipped `npm install` |
| Port 5173 is busy | Vite picks the next port; use the link it prints |
| Strange errors after pulling | Delete the `node_modules` folder, then run `npm install` again |

---

## 3. Push the code to GitHub

The repo is `https://github.com/harsha2511/RIT-Notebook`.

```bash
git add .
git commit -m "Your message"
git push origin <branch-name>      # e.g. main or react-migration
```

`node_modules/` and `dist/` are in `.gitignore`, so they are never pushed. Vercel builds the site itself.

---

## 4. Required file for Vercel: `vercel.json`

This is a single-page app. A URL like `/labcodes/cprog/c1.html` is **not a real file**; React makes that page in the browser. Without the rule below, opening or refreshing any page other than `/` on Vercel gives a **404**.

Create `vercel.json` in the project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Real files (images, PDFs, `sitemap.xml`, JS/CSS) are still served normally. Vercel only uses the rewrite when no file matches.

Commit and push it with the rest of the code.

---

## 5. Deploy on Vercel (one-time setup)

1. Go to **https://vercel.com** and **sign up / log in with GitHub**.
2. Click **Add New… → Project**.
3. Find **RIT-Notebook** in the list and click **Import**.
   - If it's not listed: click **Adjust GitHub App Permissions** and give Vercel access to the repo.
4. Check the settings (Vercel usually fills these in by itself):

   | Setting | Value |
   |---------|-------|
   | Framework Preset | **Vite** |
   | Root Directory | `./` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

   No environment variables are needed.
5. Click **Deploy**. After about a minute you get a live link like `https://rit-notebook.vercel.app`.

---

## 6. How auto-deploy works after that

Once GitHub is connected, there's nothing more to do by hand:

| You do | Vercel does |
|--------|-------------|
| Push to the **production branch** (`main` by default) | Builds and updates the **live site** |
| Push to any other branch, or open a Pull Request | Builds a **Preview** link just for that branch/PR (posted on the PR) |

To change the production branch: **Project → Settings → Git → Production Branch**.

So the usual flow is: **work on a branch → push → check the preview link → merge to `main` → live site updates.**

---

## 7. Custom domain (optional)

1. **Project → Settings → Domains → Add**, then type your domain.
2. Add the DNS record Vercel shows you (usually an `A` record or a `CNAME`) at your domain provider.
3. Wait for it to turn green. HTTPS is set up for you.

If the domain changes, update the URLs in `public/sitemap.xml` (they currently point to `ritnotebook.pages.dev`).

---

## 8. Notes

- `public/_headers` is a **Cloudflare Pages** file. Vercel ignores it. On Vercel, headers go in `vercel.json` under `"headers"`.
- `public/googlea47eb8e2223e8e50.html` is the Google Search Console verification file. Keep it so the site stays verified.
- To undo a bad deploy: **Project → Deployments**, pick an older working deployment, then **⋯ → Promote to Production** (or Instant Rollback).
- Build logs for any deploy are under **Project → Deployments → click the deploy**.
