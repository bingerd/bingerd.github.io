# Evidence images — to collect

Drop images in this folder with the exact filenames below, then ask Claude to wire
them into the posts (the placeholder comments are already at the right spots, and
`<figure>`/`<figcaption>` styling is ready in `css/blog.css`).

Prefer PNG for screenshots, JPG for photos. Redact anything sensitive before adding.

| Priority | Post | What to capture | Filename |
|---|---|---|---|
| ★★★ | Minecraft killswitch | GCP billing page showing a €2–4 month (ideally next to a heavier month) | `minecraft-bill.png` |
| ★★ | Minecraft killswitch | The Cloud Run dashboard with the START button / status view | `minecraft-dashboard.png` |
| ★★ | My Home Runs on Git Push | Photo of the actual NUC in the living room | `nuc.jpg` |
| ★★ | My Home Runs on Git Push | Argo CD UI with all app tiles green/synced | `argo-apps.png` |
| ★★ | Terraform & load testing | Locust HTML report or response-time chart showing P90 under load | `locust-report.png` |
| ★★ | Atlas | iPhone screenshot of Atlas answering with citations, or Xcode test navigator (520 tests / ~3s) | `atlas-app.png` |
| ★★★ | Atlas: taming small models | macOS chat with LFM2.5 2.6B showing a recovered tool row above a grounded answer | `atlas-leak-recovered.png` |
| ★★★ | Atlas: retrieve, then generate | iPhone chat with the `search_knowledge` row and sources pill on a gated turn, next to a chit-chat turn with no tool row | `atlas-gated-turn.png` |
| ★★ | Atlas: network boundary | Settings cloud-model screen with the data notice, or the chat's persistent cloud banner | `atlas-cloud-notice.png` |
| ★★ | Atlas: network boundary | The per-photo consent dialog showing the prepared photo and its size | `atlas-photo-consent.png` |
| ★★★ | Atlas: ears and eyes | Transcribe tab mid-session, live transcript with speaker labels and running clock | `atlas-transcribe-live.png` |
| ★★★ | Atlas: ears and eyes | Look / Observe with the camera and an answer card | `atlas-look-observe.png` |
| ★★ | Atlas: experiments | `AtlasCLI explain` on a synthetic or redacted query (per-stage ranks + score breakdown) | `atlas-cli-explain.png` |
| ★ | Atlas: experiments | `AtlasCLI batch --compare` on synthetic golden-set queries, two rankings side by side | `atlas-cli-compare.png` |
| ★★ | Atlas: July to November | Settings model list with context windows and the Model Arena podium | `atlas-model-menu.png` |
| ★★ | Atlas: July to November | Notes tab on Mac with Live Preview on a daily note | `atlas-notes-live-preview.png` |
| ★★ | Atlas: July to November | Mac meeting view with the agenda River and one fact-check card | `atlas-meeting-river.png` |
| ★ | Home Assistant on k8s | HA dashboard, or `kubectl get pods` showing the 2-container pod | `ha-pod.png` |
| ★ | Receipt agent | Redacted chat screenshot of the bot confirming/declining an expense — **check shareability with Xebia first** | `receipt-chat.png` |
| ★ | Agent course | Phoenix trace screenshot from an exercise, or a classroom photo | `course-phoenix.png` |
| ★ | TU Delft course | A student pipeline all green in GitHub Actions, or the GCP billing page at €0.00 | `tudelft-pipeline.png` |

The matching placeholder comments in the posts look like:
`<!-- IMAGE SLOT: ... (docs/blog/images/<filename>) -->`
