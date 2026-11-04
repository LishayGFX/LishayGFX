import { mkdir, readFile, writeFile } from 'node:fs/promises';

const owner = 'LishayGFX';
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
async function get(path) {
  // Public endpoints only; deliberately do not attach credentials.
  const response = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'LishayGFX-profile' },
  });
  if (!response.ok) throw new Error(`Public API returned ${response.status}`);
  return response.json();
}
const user = await get(`/users/${owner}`);
const repos = [];
for (let page = 1; ; page++) {
  const batch = await get(`/users/${owner}/repos?type=owner&per_page=100&page=${page}`);
  repos.push(...batch.filter(repo => repo.private === false && repo.owner.login.toLowerCase() === owner.toLowerCase()));
  if (batch.length < 100) break;
}
const counts = [repos.length, repos.reduce((sum, repo) => sum + repo.stargazers_count, 0), user.followers];
if (counts.some(value => !Number.isSafeInteger(value) || value < 0)) throw new Error('Invalid public metrics');
const project = repos.find(repo => repo.name === 'atlas-survival-resource-pack');
if (!project) throw new Error('Featured public repository unavailable');
const date = new Date().toISOString().slice(0, 10);
const year = new Date(user.created_at).getUTCFullYear();
if (!Number.isInteger(year)) throw new Error('Invalid account creation date');

const snake = await readFile('assets/snake.svg', 'utf8');
// The generated SVG is embedded, so the activity shares the same window.
// Refuse unexpected active content rather than injecting it into our asset.
if (!/^<svg\s/.test(snake) || /<(?:script|foreignObject|image|iframe)\b|\son\w+\s*=|(?:href|xlink:href)\s*=/i.test(snake)) {
  throw new Error('Unexpected contribution SVG content');
}
const nestedSnake = snake.replace('<svg ', '<svg x="42" y="591" width="916" height="171" ')
  .replace(/ width="880" height="192"/, '');
const art = await readFile('assets/ascii-knot.svg', 'utf8');
if (!/^<svg\s/.test(art) || /<(?:script|foreignObject|image|iframe)\b|\son\w+\s*=|(?:href|xlink:href)\s*=/i.test(art)) throw new Error('Unexpected artwork content');
const nestedArt = art.replace('width="384" height="256"', 'x="24" y="77" width="430" height="279"');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="820" viewBox="0 0 1000 820" role="img" aria-labelledby="profileTitle profileDesc">
<title id="profileTitle">LishayGFX</title>
<desc id="profileDesc">Rotating ASCII torus knot from ASCII Magic. LishayGFX, on GitHub since ${year}. ${counts[0]} public repositories, ${counts[1]} public repository stars, ${counts[2]} followers. Atlas Survival: ${escape(project.description || project.name)}. Animated contribution calendar. Updated ${date} UTC.</desc>
<defs>
<pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.5" fill="#ffffff" opacity="0.025"/></pattern>
<linearGradient id="t-scanGlow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#df4553" stop-opacity="0"/><stop offset="0.85" stop-color="#df4553" stop-opacity="0.16"/><stop offset="1" stop-color="#df4553" stop-opacity="0"/></linearGradient>
<clipPath id="t-artBounds"><rect x="24" y="77" width="430" height="279"/></clipPath>
<linearGradient id="t-card" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#171215"/><stop offset="0.65" stop-color="#111115"/></linearGradient>
</defs>
<style>
.t-text{font-family:Consolas,'Liberation Mono',monospace}
.t-human{font-family:Arial,Helvetica,sans-serif}
.t-cursor{animation:t-blink 1.2s step-end infinite}
.t-info{animation:t-enter 0.7s ease both}
.t-project{animation:t-enter 0.7s 0.18s ease both}
.t-activity{animation:t-enter 0.7s 0.36s ease both}
.t-scan{animation:t-scan 10s linear infinite}
.t-trace{animation:t-trace 12s linear infinite;stroke-dasharray:32 968}
.t-typing{animation:t-type 2s 0.7s steps(10,end) both}
.t-dot{animation:t-pulse 5s ease-in-out infinite}
@keyframes t-blink{50%{opacity:0}}
@keyframes t-enter{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes t-scan{0%{transform:translateY(-40px);opacity:0}10%{opacity:1}60%{transform:translateY(280px);opacity:1}65%,100%{transform:translateY(280px);opacity:0}}
@keyframes t-trace{to{stroke-dashoffset:-1000}}
@keyframes t-type{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes t-pulse{50%{opacity:0.4}}
@media(prefers-reduced-motion:reduce){.t-cursor,.t-info,.t-project,.t-activity,.t-typing,.t-dot,.c,.s,.u{animation:none!important}.t-scan,.t-trace{display:none}}
</style>
<rect x="1" y="1" width="998" height="818" rx="14" fill="#0e0e12" stroke="#33333a"/>
<rect x="2" y="2" width="996" height="816" rx="13" fill="url(#grain)"/>
<path d="M15 1h970" stroke="#57505a" stroke-opacity="0.7"/>
<path d="M1 49h998M1 777h998" stroke="#29292f"/>
<circle class="t-dot" cx="26" cy="25" r="4" fill="#df4553"/><circle cx="42" cy="25" r="4" fill="#45454d"/><circle cx="58" cy="25" r="4" fill="#45454d"/>
<g class="t-text">
<text x="86" y="31" fill="#9b9ba6" font-size="13">lishaygfx / profile</text>
<text x="958" y="31" text-anchor="end" fill="#777781" font-size="12">~/github</text>

<g class="t-info">
${nestedArt}
<g clip-path="url(#t-artBounds)"><rect class="t-scan" x="24" y="77" width="430" height="32" fill="url(#t-scanGlow)"/></g>
<text class="t-human" x="496" y="151" fill="#f2f2f5" font-size="49" font-weight="600">Lishay<tspan fill="#df6570">GFX</tspan></text>
<text class="t-human" x="498" y="191" fill="#a2a2af" font-size="19">github.com/LishayGFX</text>
<text class="t-human" x="498" y="223" fill="#868693" font-size="16">On GitHub since ${year}</text>
<path d="M498 249h460" stroke="#2c2c34"/>
${counts.map((value, i) => `<text class="t-human" x="${498 + i * 165}" y="288" fill="#e8e8ee" font-size="25">${value}</text><text class="t-human" x="${498 + i * 165}" y="318" fill="#a2a2ad" font-size="14">${['Public repos', 'Repo stars', 'Followers'][i]}</text>`).join('')}
</g>

<g class="t-project">
<path d="M42 362h916" stroke="#27272f"/>
<text class="t-human" x="42" y="397" fill="#c8c8d1" font-size="17">Projects</text>
<rect x="42" y="418" width="916" height="122" rx="8" fill="url(#t-card)" stroke="#302a30"/>
<rect class="t-trace" x="42" y="418" width="916" height="122" rx="8" fill="none" stroke="#b8404d" stroke-width="1.2" pathLength="1000"/>
<rect x="62" y="440" width="78" height="78" rx="8" fill="#20171c"/>
<path d="m77 468 24-14 24 14-24 14Zm0 0v24l24 14 24-14v-24m-24 14v24" fill="none" stroke="#d26873" stroke-width="1.7" stroke-linejoin="round"/>
<text class="t-human" x="164" y="469" fill="#efeff4" font-size="26">Atlas Survival</text>
<text class="t-human" x="164" y="502" fill="#a8a8b4" font-size="18">Official Minecraft resource pack releases.</text>
<circle cx="917" cy="479" r="19" fill="#20171c"/>
<path d="M910 472h13v13m0-13-13 13" stroke="#df6570" stroke-width="1.7" fill="none"/>
</g>

<g class="t-activity">
<text class="t-human" x="42" y="583" fill="#c8c8d1" font-size="17">Activity</text>
<text class="t-human" x="958" y="583" text-anchor="end" fill="#90909c" font-size="14">Contribution calendar</text>
</g>
</g>
<g class="t-activity">${nestedSnake}</g>
<g class="t-text" font-size="13">
<text x="25" y="803" fill="#df4553">❯</text>
<g class="t-typing"><text x="43" y="803" fill="#a4a4b1">git status <tspan class="t-cursor" fill="#df4553">▍</tspan></text></g>
<text x="975" y="803" text-anchor="end" fill="#878793">Public data · ${date} UTC</text>
</g></svg>`;
await mkdir('assets', { recursive: true });
await writeFile('assets/terminal-art.svg', svg + '\n');
console.log(`Generated terminal profile from public data (${date} UTC)`);
