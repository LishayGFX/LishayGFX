# Profile maintenance

This is an original black/red terminal design inspired by the composition of [GitSkins Terminal](https://www.gitskins.com/templates/terminal) and [Neofetch](https://www.gitskins.com/templates/neofetch). No template assets or code are copied.

## Design

The README displays one SVG window with a rotating ASCII torus knot from ASCII Magic, public profile data, a featured project, and an animated contribution calendar. Normal links below the image open the repository and profile pages; the drawn project arrow is decorative because links inside an SVG image are not interactive on GitHub.

The panels appear in a short startup sequence. The artwork, scan, border accent, and cursor then loop quietly. Reduced-motion styling disables all motion, including the artwork, scan, border accent, and embedded snake. Images include accessible titles and descriptions. No external fonts, scripts, third-party stats cards, inferred role, or invented tech stack are used.

## Data and privacy

Run `node scripts/terminal.mjs` from the repository root after generating `assets/snake.svg`. It writes `assets/terminal-art.svg`.

Profile and repository counts come from unauthenticated GitHub REST endpoints. Only publicly listed owned repositories are counted. API failures stop the update instead of publishing false zeroes. The account creation year also comes from the public profile. These are dated snapshots.

The snake is generated with [Platane/snk](https://github.com/Platane/snk) using the repository-scoped automatic `GITHUB_TOKEN`, never a personal token. It contains no private repository names or details. A public GitHub calendar can include anonymous private contribution counts if the account owner enables that setting.

## Automation and preview

The pinned workflow generates the snake, then embeds it into the complete profile window alongside fresh public data. Both generated SVGs are committed to the branch the workflow runs on. The preview branch never pushes to main.

It runs on relevant preview/main pushes, manually, and daily at 06:23 UTC once merged to the default branch. Repository rules may prevent bot pushes; failures leave the last successful published window intact. GitHub can disable schedules in inactive public repositories.

Review README.md on `preview/red-black-terminal`. The draft PR must be merged before the live profile changes.

The artwork is a red monochrome adaptation of ASCII Magic's Torus Knot, embedded as pre-rendered SVG frames. See THIRD_PARTY_NOTICES.md for the original source and MIT license. Main titles and profile text use Arial/Helvetica; monospace is limited to artwork and small terminal labels.

The personal focus (websites, apps, and vibe coding) was supplied by the account owner. Project format counts come from the public repository file tree, pack format comes from pack.mcmeta, and the latest non-prerelease release supplies its version, publication date, and ZIP size. These are project details, not inferred personal skill ratings. The generator stops on incomplete tree data or unavailable required sources.
