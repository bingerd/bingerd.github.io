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
| ★ | Home Assistant on k8s | HA dashboard, or `kubectl get pods` showing the 2-container pod | `ha-pod.png` |
| ★ | Receipt agent | Redacted chat screenshot of the bot confirming/declining an expense — **check shareability with Xebia first** | `receipt-chat.png` |
| ★ | Agent course | Phoenix trace screenshot from an exercise, or a classroom photo | `course-phoenix.png` |
| ★ | TU Delft course | A student pipeline all green in GitHub Actions, or the GCP billing page at €0.00 | `tudelft-pipeline.png` |

The matching placeholder comments in the posts look like:
`<!-- IMAGE SLOT: ... (docs/blog/images/<filename>) -->`
