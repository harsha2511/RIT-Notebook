# RIT Notebook

Notes, lab codes, previous year papers and maths question banks for RIT engineering students, all in one place.

**Live site:** https://ritnotebook.pages.dev

## What's on the site

| Page | What you get |
|------|--------------|
| **Home** | Quick links to PYQs, syllabus, Skill Lab, Open Electives and uploads, plus notes by year |
| **Notes** | 1st year by stream (Physics and Chemistry cycle), 2nd to 4th year by branch. Notes open on Google Drive |
| **Lab Codes** | Full code for 1st and 2nd year labs (C, C++, Java, Python, MATLAB, web dev, ACN), with search and copy |
| **Maths QB** | Maths question banks for semesters 1 to 4 |
| **About** | The developer, our websites and a tour of the site |

Also: light and dark theme, works on phones (swipe between years on the Notes pages), and every old `.html` link still works.

## Tech stack

- [React 18](https://react.dev) with [React Router 6](https://reactrouter.com)
- [Vite 5](https://vitejs.dev) for the dev server and build
- Plain CSS, one stylesheet per page, scoped automatically by `vite.config.js`
- No backend and no database: all content lives in `src/data/`

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/harsha2511/RIT-Notebook.git
cd RIT-Notebook
./run.sh
```

`run.sh` installs the packages the first time, starts the site and opens it in your browser (usually http://localhost:5173). Press `Ctrl+C` to stop it.

Or do it by hand:

```bash
npm install
npm run dev        # start the dev server
npm run build      # build the site into dist/
npm run preview    # serve the built site to check it
```

## Project layout

```
RIT-Notebook/
├── index.html            Page shell (theme script, ad script)
├── public/               Files served as they are: images, PDFs, sitemap, Google verification
├── src/
│   ├── main.jsx          Starts React and the router
│   ├── App.jsx           All page routes (they keep the old .html URLs)
│   ├── components/       Navbar, year tabs, theme toggle, page wrapper
│   ├── pages/            One file per page (Home, About, LabCodes, Program, ...)
│   ├── data/             All site content (notes links, lab programs, question banks)
│   ├── styles/           Global styles, dark theme, per-page styles, notes animations
│   └── utils/            Helpers (splitting lab programs into parts)
├── docs/                 How the project works, running and deploying
├── run.sh                One-click local setup
└── vite.config.js        Build settings and per-page CSS scoping
```

## Adding or changing content

Content is in plain JavaScript files in `src/data/`, so most updates don't touch any page code:

| To change | Edit |
|-----------|------|
| 1st year subjects and their Drive links | `src/data/firstYear.js` |
| 2nd to 4th year branch links | `src/data/yearNotes.js` |
| Lab subjects shown on the Lab Codes page | `src/data/labIndex.js` |
| Programs in each lab subject | `src/data/labSubjects.js` |
| The code of each program | `src/data/programs.js` |
| Maths question banks | `src/data/mathQB.js` |

Then run `npm run dev` to check it.

## Deployment

The site is hosted on **Cloudflare Pages** and connected to this repo:

- A push to `main` builds and updates the live site in about a minute.
- A push to any other branch gets its own preview link.
- Build settings: build command `npm run build`, output directory `dist`.

More detail is in [`docs/02-run-locally-and-deploy.md`](docs/02-run-locally-and-deploy.md).

## Contributing notes

Have good notes? Upload them to the [shared folder](https://drive.google.com/drive/folders/1_XJvCLOO_9g4QEgiO_fBZCtdfxWhZdNC?usp=sharing) or write to labcodesandnotes@gmail.com.

## Developer

**Harsha**, Electrical & Electronics Engineering, batch 2022–2026
[Portfolio](https://harsha-kumari-portfolio.vercel.app) · [LinkedIn](https://www.linkedin.com/in/harsha-kumari-246084294/)

Sister site: [RIT Code](https://ritcode.pages.dev), codes and resources for EEE students.
