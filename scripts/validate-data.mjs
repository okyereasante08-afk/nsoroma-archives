// Checks src/data/hardware.json before every build. Run manually with: npm run validate
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/hardware.json'), 'utf8'))

const required = [
  'id', 'name', 'category', 'mission', 'launchDate', 'launchEra', 'missionEndDate',
  'status', 'statusDetail', 'lastContactDate', 'physicalLocation', 'environment',
  'purpose', 'simpleExplanation', 'scientificContribution', 'historicalSignificance',
  'image', 'imageAltText', 'model', 'modelDescription', 'modelSource', 'audioDescription',
  'audioFile', 'videoCaptions', 'videoTranscript', 'signLanguageResource',
  'visualExplanation', 'sourceLinks', 'verified', 'reviewNotes',
]
const dateOk = (d) => d === null || /^\d{4}-\d{2}-\d{2}$/.test(d)

let errors = 0
const fail = (msg) => { console.error('  X ' + msg); errors++ }
const ids = new Set()

data.forEach((item, i) => {
  const tag = `Record ${i + 1} (${item.id || 'no id'})`
  required.forEach((f) => { if (item[f] === undefined) fail(`${tag}: missing field "${f}" (use null if unknown)`) })
  if (ids.has(item.id)) fail(`${tag}: duplicate id`)
  ids.add(item.id)
  if (!['ACTIVE', 'INACTIVE'].includes(item.status)) fail(`${tag}: status must be ACTIVE or INACTIVE`)
  ;['launchDate', 'missionEndDate', 'lastContactDate'].forEach((f) => {
    if (!dateOk(item[f])) fail(`${tag}: ${f} must be YYYY-MM-DD or null`)
  })
  ;['image', 'model', 'audioFile'].forEach((f) => {
    if (item[f] && !fs.existsSync(path.join(root, 'public', item[f]))) fail(`${tag}: ${f} file not found at public${item[f]}`)
  })
  const toList = (v) => (Array.isArray(v) ? v : [])
  if (item.video) {
    if (!toList(item.videoCaptions).length) fail(`${tag}: a video needs videoCaptions`)
    if (!toList(item.videoTranscript).length) fail(`${tag}: a video needs videoTranscript`)
  }
  ;[item.video, item.signLanguageResource, ...toList(item.videoCaptions).map((c) => c && c.src)].filter(Boolean).forEach((f) => {
    if (!fs.existsSync(path.join(root, 'public', f))) fail(`${tag}: video file not found at public${f}`)
  })
  if (item.image && !item.imageAltText) fail(`${tag}: image needs imageAltText`)
  if (item.model && !item.modelDescription) fail(`${tag}: model needs modelDescription`)
  if (item.model && !item.modelSource) fail(`${tag}: model needs modelSource (attribution)`)
})

// Scroll backgrounds
const backgrounds = JSON.parse(fs.readFileSync(path.join(root, 'src/data/backgrounds.json'), 'utf8'))
backgrounds.forEach((bg, i) => {
  if (!fs.existsSync(path.join(root, 'public', bg.src))) fail(`backgrounds.json #${i + 1}: file not found at public${bg.src}`)
})

// Explainer video: files must exist, and a video must come with captions and a transcript
const story = JSON.parse(fs.readFileSync(path.join(root, 'src/data/story.json'), 'utf8'))
const storyFiles = [story.video, story.poster, story.audioDescribedVideo, story.signLanguageVideo, ...(story.captions || []).map((c) => c.src)]
storyFiles.filter(Boolean).forEach((f) => {
  if (!fs.existsSync(path.join(root, 'public', f))) fail(`story.json: file not found at public${f}`)
})
if (story.video && !(story.captions || []).length) fail('story.json: a video needs at least one captions track')
if (story.video && !(Array.isArray(story.transcript) && story.transcript.length)) fail('story.json: a video needs a transcript')

if (errors) {
  console.error(`\nhardware.json has ${errors} problem(s). Fix them and try again.`)
  process.exit(process.argv.includes('--warn') ? 0 : 1)
}
console.log(`hardware.json OK: ${data.length} records.`)
