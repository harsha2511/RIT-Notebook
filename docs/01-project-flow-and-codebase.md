# RIT Notebook: How the Project Works

## What it is

RIT Notebook is a website for RIT engineering students. It has:

- **Notes** for 1st to 4th year. These are links to Google Drive folders.
- **Lab codes**: about 90 lab programs (C, C++, Java, Python, MATLAB, HTML, ACN) that you can read and copy on the site.
- **Maths question bank**: links to past maths papers, grouped by semester.
- **About page**: info about the developer and related sites.

It is a **React single-page app** built with **Vite**. There is no backend and no database. All content is stored in JavaScript data files inside `src/data/`.

---

## Tech stack

| Tool | Why it is used |
|------|----------------|
| React 18 | Builds the UI |
| React Router 6 | Changes pages without reloading the site |
| Vite 5 | Dev server and production build |
| postcss-prefix-selector | Keeps each page's CSS limited to that page |

---

## Folder structure

```
RIT-Notebook/
├── index.html            # The only HTML page. React loads into <div id="root">
├── vite.config.js        # Vite setup and the CSS scoping rule
├── package.json          # Scripts and dependencies
├── run.sh                # One-click setup + run (see doc 02)
├── .vscode/launch.json   # "Run RIT Notebook" button in VS Code
├── public/               # Copied to the build as-is
│   ├── images/           # Logos, subject images, icons, team photos
│   ├── pdf/              # PDF files
│   ├── sitemap.xml       # For search engines
│   ├── _headers          # Cloudflare Pages file (Vercel ignores it)
│   └── google…html       # Google Search Console verification
├── src/
│   ├── main.jsx          # Starting point: mounts React with the router
│   ├── App.jsx           # Lists every route (URL → page)
│   ├── components/       # Parts shared by many pages
│   ├── pages/            # One file per page
│   ├── data/             # All the site content (links, programs)
│   ├── utils/            # Helper code (parseProgram.js)
│   └── styles/           # Global CSS, dark theme, CSS for each page
└── dist/                 # Build output (made by `npm run build`, not in git)
```

---

## Full flow (what happens when someone opens the site)

1. **The browser loads `index.html`.**
   - A small script reads the saved theme (`light`/`dark`) from `localStorage`. If nothing is saved, it uses the device setting. It sets `data-theme` on `<html>` **before the page shows**, so the page never flashes the wrong theme.
   - An ad script also loads here.
   - Then it loads `src/main.jsx`.

2. **`main.jsx` starts React.**
   - It wraps the app in `BrowserRouter` so URLs work.
   - It loads `global.css` and `dark.css`.

3. **`App.jsx` decides which page to show.**
   - `ScrollToTop` and `Navbar` show on every page.
   - Then `<Routes>` matches the URL to a page (table below).

4. **The page reads its content from `src/data/`** and shows it.

5. **Clicking a link** inside the site changes the page without a reload (React Router). Notes and question-bank links open Google Drive in a new tab.

### Routes

The URLs still end in `.html`. They match the old static site, so old links, bookmarks and Google results still work.

| URL | Page | Data used |
|-----|------|-----------|
| `/` | `Home.jsx` | none |
| `/index.html` | redirects to `/` | none |
| `/about.html` | `About.jsx` | none |
| `/notes/first.html` | `FirstYear.jsx` | `firstYear.js` |
| `/notes/second.html`, `third.html`, `fourth.html` | `YearNotes.jsx` | `yearNotes.js` |
| `/labcodes.html` | `LabCodes.jsx` | `labIndex.js`, `labSubjects.js` |
| `/labcodes/c.html`, `java.html`, … | `SubjectCodes.jsx` | `labSubjects.js`, `labIndex.js` |
| `/labcodes/<folder>/<file>` (e.g. `/labcodes/cprog/c1.html`) | `Program.jsx` | `programs.js` |
| `/mathqb.html` | `MathQB.jsx` | `mathQB.js` |
| anything else | `NotFound.jsx` | none |

The year-notes routes and subject routes are **generated from the data files**. Adding an entry with a new `path` to `yearNotes.js` or `labSubjects.js` adds a new page.

`Program.jsx` is **lazy-loaded**. `programs.js` is big, so it is only downloaded when someone opens a program.

---

## Components (`src/components/`)

| File | What it does |
|------|--------------|
| `Navbar.jsx` | Top bar: logo, links, Notes dropdown, mobile menu, theme button. Menus close when the page changes, and the dropdown closes on outside click or Esc. |
| `ThemeToggle.jsx` | Switches light/dark, updates `data-theme` and saves it to `localStorage`. |
| `Page.jsx` | Wraps every page. Sets the tab title (`<title> \| RIT Notebook`) and adds the `page-<name>` class used by that page's CSS. |
| `YearTabs.jsx` | 1st–4th year switcher on the notes pages. |
| `ScrollToTop.jsx` | Scrolls to the top when the URL changes. |

---

## Pages (`src/pages/`)

| File | What it shows |
|------|---------------|
| `Home.jsx` | Landing page with links to every section. |
| `FirstYear.jsx` | 1st year notes by stream and cycle (Physics/Chemistry). The selected stream is kept in the URL (`?…`). |
| `YearNotes.jsx` | 2nd–4th year notes. Branches are grouped into Computer Science, Electrical & Electronics and Core Engineering, and each opens a Drive folder. |
| `LabCodes.jsx` | All lab subjects grouped by year. Each one links to a subject page, or to Drive if its codes aren't on the site. |
| `SubjectCodes.jsx` | List of programs for one subject, with a sidebar of all subjects and a PDF/Drive link. |
| `Program.jsx` | One program: question, code with line numbers, a **Copy** button, tabs when there are several versions, and a sidebar of the other programs. |
| `MathQB.jsx` | Maths question papers by semester. |
| `About.jsx` | Developer card, other sites, and a section that animates in as you scroll. |
| `NotFound.jsx` | 404 page. |

---

## Data (`src/data/`)

All content lives here. **To change content, edit these files. You don't need to touch the pages.**

| File | Contains |
|------|----------|
| `firstYear.js` | 1st year streams → cycles → subjects → Drive links |
| `yearNotes.js` | 2nd–4th year: `path`, `title` and branches (`code`, `name`, Drive `href`) |
| `labIndex.js` | Lab subjects per year (`name`, image, link) for the Lab Codes page |
| `labSubjects.js` | Each subject page: `path`, `title`, PDF link and its list of programs |
| `programs.js` | Every program, keyed by URL: `title` and the original page `html` |
| `labLanguages.js` | Folder → language (e.g. `cprog` → C). ACN has mixed code, so it guesses Java or Python from the code. |
| `mathQB.js` | Semesters → papers (`code`, branches, Drive link) |

Most data files were **generated from the old static HTML pages**.

---

## How a lab program is shown

Programs are still stored as the **old page HTML** (an `<h1>` question plus a `.code-box` with lines split by `<br>`). `src/utils/parseProgram.js` turns that into clean code:

1. Finds each `.code-box` and the `<h1>` just before it (the heading).
2. Splits the code into lines at `<br>`, decodes things like `&lt;`, and turns old non-breaking spaces into indentation.
3. Fixes lines where a comment got stuck to code.
4. **Auto-indents** C, C++, Java and HTML code that was saved without indentation (based on `{ }` and HTML tags).
5. Splits one box into parts when:
   - a comment is just a file name (e.g. `#server.py`, `#client.py`), which becomes the box title, or
   - a MATLAB `%` comment comes before a new `syms` line (a new part).

`Program.jsx` then shows each part in its own code panel with a Copy button. The Copy button uses the Clipboard API and falls back to the old `execCommand('copy')` if that fails.

---

## Styling

- `styles/global.css`: shared styles and **theme colour variables** (`--bg`, `--text`, …) for light, plus overrides under `[data-theme="dark"]`.
- `styles/dark.css`: extra dark-mode fixes the variables don't cover.
- `styles/pages/<name>.css`: one file per page (copied from the old site).

**CSS scoping (in `vite.config.js`):** the old page CSS styles global things like `body` or `.navbar`. To stop pages from breaking each other, every rule in `styles/pages/<name>.css` gets the prefix `.page-<name>`. For example, `body` becomes `.page-home` and `.card` becomes `.page-home .card`. `Page.jsx` adds that class, so each page's CSS only applies to that page.

So: a page using `<Page name="lab">` must import `styles/pages/lab.css`.

---

## Common tasks

| I want to… | Do this |
|------------|---------|
| Change a Drive link | Edit the matching file in `src/data/` |
| Add a branch to 2nd–4th year | Add `{ code, name, href }` to that year in `yearNotes.js` (and to `GROUPS` in `YearNotes.jsx` if it's a new code) |
| Add a lab program | Add it to `programs.js` (key = URL), then add `{ label, to }` to its subject in `labSubjects.js` |
| Add a new lab subject | Add it to `labIndex.js` and `labSubjects.js` (and `labLanguages.js` if it's a new folder) |
| Add a new page | Make `src/pages/X.jsx` wrapped in `<Page name="x">`, add `src/styles/pages/x.css`, then add a `<Route>` in `App.jsx` and a link in `Navbar.jsx` |
| Add images/PDFs | Put them in `public/` and use them as `/images/...` or `/pdf/...` |
