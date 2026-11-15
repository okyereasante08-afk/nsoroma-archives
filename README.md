# NSOROMA ARCHIVES

An inclusive digital space museum for the NASA Space Apps Challenge. Built with React + Vite. All machine data lives in one file: `src/data/hardware.json`.

## Run it on your computer

Install Node.js 18 or newer, then in this folder:

```
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

## Publish it

1. Create an empty repository on GitHub, then in this folder run:
   `git init`, `git add .`, `git commit -m "First version"`, `git branch -M main`,
   `git remote add origin <your repo URL>`, `git push -u origin main`
2. Go to vercel.com, choose **Add New Project**, import the repository and press **Deploy**. Vercel detects Vite by itself. Every `git push` after that updates the live site.

## How the site is organised

- Home page: hero, rotating **Featured machines** carousel, story, about, searchable archive, sources.
- Each machine has its own full-screen page at `#/machine/<id>` (for example `#/machine/sojourner-rover`). Cards are normal links, so they can be opened in a new tab.

## Folder map

| Path | What it is |
| --- | --- |
| `src/data/hardware.json` | Every machine. The site builds itself from this file. |
| `public/assets/images` | Photos (`.webp`), named like the machine's id, for example `sojourner-rover.webp` |
| `public/assets/models` | 3D models (`.glb`), named by id |
| `public/assets/audio` | Human voiceovers (`.mp3`), named by id |
| `public/assets/video` | Explainer video, captions and transcripts (not wired in yet) |
| `src/components` | Pieces of the page (archive, inspector, accessibility panel...) |
| `src/styles.css` | All styling and colours |
| `RESEARCH_TEMPLATE.md` | Plain-text form for teammates who research |

## How to add or change a machine

1. Open `src/data/hardware.json`. Copy an existing record and change every value. Each `id` must be unique, lowercase, with dashes.
2. Use `null` for anything you do not have yet. Never invent a file path.
3. Run `npm run validate`. It lists any mistake in plain words. It also runs automatically before `npm run build`.

## Adding media (media team)

- **3D model:** convert to `.glb`, keep it under about 10 MB, put it in `public/assets/models/`. In the record set `"model": "/assets/models/<id>.glb"` and fill in `"modelSource"` with the credit. The site shows a friendly message if there is no model.
- **Photo:** put it in `public/assets/images/`, set `"image"` and write `"imageAltText"` describing what the picture shows. The photo appears in the home-page carousel and on the machine's own page. Until then a placeholder shows.
- **Voiceover:** put an `.mp3` in `public/assets/audio/` and set `"audioFile": "/assets/audio/<id>.mp3"`. A player appears in the inspector. The written `audioDescription` stays as the text version and is what read-aloud uses.

## Scroll background

`src/data/backgrounds.json` lists the pictures that fade in behind the page as you scroll (blue first, then each picture in order, darkened so text stays readable). To use your own: put images (`.jpg`, `.webp` or `.svg`, ideally under 400 KB) in `public/assets/backgrounds/` and add a line for each in the file. You must have the right to use every image, so add a credit. It stays plain blue when reduced motion or high contrast is on.

## Explainer video

Everything is set in `src/data/story.json`. Put files in `public/assets/video/` and fill in the paths:

- `video`: the main `.mp4`. `poster`: an optional still image.
- `captions`: a list like `[{ "lang": "en", "label": "English", "src": "/assets/video/story.en.vtt" }]`. Captions are `.vtt` files: the first line is `WEBVTT`, then blocks such as `00:00:00.000 --> 00:00:04.000` followed by the spoken words and sound descriptions.
- `audioDescribedVideo`: optional second `.mp4` with extra narration describing the visuals. A checkbox lets visitors switch to it.
- `signLanguageVideo`: optional `.mp4` of the interpreter, shown beside the main video.
- `transcript`: a list of paragraphs, for example `["Narrator: Welcome...", "..."]`.

`npm run validate` refuses to build if a video has no captions or transcript.

## Video for each machine

Double-clicking or double-tapping a 3D model (or pressing Enter while it has keyboard focus) asks "Watch the video about this machine?" with the options "Yes, watch the video" and "No, it was a mistake". A "Watch the video" button on the machine page does the same without the question. Add these fields to a record in `hardware.json`:

- `"video": "/assets/video/<id>.mp4"`
- `"videoCaptions": [{ "lang": "en", "label": "English", "src": "/assets/video/<id>.en.vtt" }]`
- `"videoTranscript": ["First paragraph...", "Second paragraph..."]`
- `"signLanguageResource": "/assets/video/<id>-sign.mp4"` (optional)

A machine without a `video` shows a "coming soon" message. `npm run validate` requires captions and a transcript for any video.

## Accessibility notes

- Built toward WCAG 2.2 AA: semantic landmarks, skip link, keyboard-operable everything, visible focus, native dialogs, text on every status, high contrast and reduced motion that follow the device by default.
- Preferences are saved in the browser (`localStorage`). The welcome screen is optional and can be skipped.
- Please test before claiming: keyboard only (Tab through the whole site), a screen reader (NVDA on Windows, VoiceOver on Mac/iPhone, TalkBack on Android), 200% zoom, and Lighthouse accessibility in Chrome.

## Next upgrades

- More records (Phoenix, InSight, Spirit, Opportunity, Viking 1 and 2, Dawn, NEAR Shoemaker, Kepler, ALSEP).
- Verify every entry against NASA sources, then set `"verified": true`.
