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


The personal focus and stack reflect technologies named by the owner, with earlier web-app and FiveM conversations reviewed for context. The profile lists Next.js, React, JavaScript, HTML, FiveM, Lua, and C++ without claiming a usage ranking, experience level, or proficiency percentage. No private project names, chat excerpts, or repository details are published. The featured project's current stable version comes from its public releases.

Location, ownership of openowl.cc and valkbypass.com, current-work wording, and both Discord handles/IDs were supplied and approved for this profile by the owner. Website links are provided without claims about their features or availability. Clickable project and Discord links are normal README links below the SVG; arrows inside the image are decorative.

Project descriptions (OpenOwl as an OSINT system, Valk as a FiveM bypass method) were supplied by the owner. Project logos were fetched from their websites with the owner's authorization. Technology and Discord icons use Simple Icons; source and license notes are in THIRD_PARTY_NOTICES.md. The logos are embedded locally so profile visitors make no requests to the project sites just to see the artwork.

The stack was refined after the owner clarified their usual FiveM tools: Lua, JavaScript, HTML, CSS, Next.js and React, with occasional custom DLL work. Earlier Discord bot chats provide context for Node.js/discord.js. The layout separates FiveM scripting, web/NUI interfaces, and other tools; C++ is not labeled as a FiveM scripting runtime. No additional languages are inferred from what FiveM supports.
