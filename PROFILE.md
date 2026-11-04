# Profile maintenance

This is an original black/red terminal design inspired by the composition of [GitSkins Terminal](https://www.gitskins.com/templates/terminal) and [Neofetch](https://www.gitskins.com/templates/neofetch). No template assets or code are copied.

## Design

The README displays one SVG window with a custom ASCII LG mark, public profile data, a featured project, and an animated contribution calendar. Normal links below the image open the repository and profile pages; the drawn project arrow is decorative because links inside an SVG image are not interactive on GitHub.

The LG reveal and cursor animations end after a few seconds. Reduced-motion styling disables the header and embedded snake animations. Images include accessible titles and descriptions. No external fonts, scripts, third-party stats cards, inferred role, or invented tech stack are used.

## Data and privacy

Run `node scripts/terminal.mjs` from the repository root after generating `assets/snake.svg`. It writes `assets/profile-window.svg`.

Profile and repository counts come from unauthenticated GitHub REST endpoints. Only publicly listed owned repositories are counted. API failures stop the update instead of publishing false zeroes. The account creation year also comes from the public profile. These are dated snapshots.

The snake is generated with [Platane/snk](https://github.com/Platane/snk) using the repository-scoped automatic `GITHUB_TOKEN`, never a personal token. It contains no private repository names or details. A public GitHub calendar can include anonymous private contribution counts if the account owner enables that setting.

## Automation and preview

The pinned workflow generates the snake, then embeds it into the complete profile window alongside fresh public data. Both generated SVGs are committed to the branch the workflow runs on. The preview branch never pushes to main.

It runs on relevant preview/main pushes, manually, and daily at 06:23 UTC once merged to the default branch. Repository rules may prevent bot pushes; failures leave the last successful published window intact. GitHub can disable schedules in inactive public repositories.

Review README.md on `preview/red-black-terminal`. The draft PR must be merged before the live profile changes.

