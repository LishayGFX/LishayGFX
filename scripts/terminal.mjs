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
const nestedSnake = snake.replace('<svg ', '<svg x="44" y="555" width="912" height="175" ')
  .replace(/ width="880" height="192"/, '');
const art = await readFile('assets/ascii-knot.svg', 'utf8');
if (!/^<svg\s/.test(art) || /<(?:script|foreignObject|image|iframe)\b|\son\w+\s*=|(?:href|xlink:href)\s*=/i.test(art)) throw new Error('Unexpected artwork content');
const nestedArt = art.replace('width="384" height="256"', 'x="44" y="98" width="290" height="208"');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="800" viewBox="0 0 1000 800" role="img" aria-labelledby="profileTitle profileDesc">
<title id="profileTitle">LishayGFX</title>
<desc id="profileDesc">Rotating ASCII torus knot from ASCII Magic. LishayGFX, on GitHub since ${year}. ${counts[0]} public repositories, ${counts[1]} public repository stars, ${counts[2]} followers. Atlas Survival: ${escape(project.description || project.name)}. Animated contribution calendar. Updated ${date} UTC.</desc>
<defs>
<pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.5" fill="#ffffff" opacity="0.025"/></pattern>
<linearGradient id="t-scanGlow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#df4553" stop-opacity="0"/><stop offset="0.85" stop-color="#df4553" stop-opacity="0.16"/><stop offset="1" stop-color="#df4553" stop-opacity="0"/></linearGradient>
<clipPath id="t-artBounds"><rect x="44" y="98" width="290" height="208"/></clipPath>
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
@keyframes t-scan{0%{transform:translateY(-40px);opacity:0}10%{opacity:1}60%{transform:translateY(210px);opacity:1}65%,100%{transform:translateY(210px);opacity:0}}
@keyframes t-trace{to{stroke-dashoffset:-1000}}
@keyframes t-type{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes t-pulse{50%{opacity:0.4}}
@media(prefers-reduced-motion:reduce){.t-cursor,.t-info,.t-project,.t-activity,.t-typing,.t-dot,.c,.s,.u{animation:none!important}.t-scan,.t-trace{display:none}}
</style>
<rect x="1" y="1" width="998" height="798" rx="12" fill="#0b0b0e" stroke="#303036"/>
<rect x="2" y="2" width="996" height="796" rx="11" fill="url(#grain)"/>
<path d="M1 49h998M1 755h998" stroke="#29292f"/>
<circle class="t-dot" cx="26" cy="25" r="4" fill="#df4553"/><circle cx="42" cy="25" r="4" fill="#45454d"/><circle cx="58" cy="25" r="4" fill="#45454d"/>
<g class="t-text">
<text x="500" y="31" text-anchor="middle" fill="#90909b" font-size="14">lishaygfx@github: ~</text>
<text x="956" y="31" text-anchor="end" fill="#5c5c68" font-size="12">zsh</text>

<g class="t-info">
<rect x="24" y="73" width="952" height="257" rx="5" fill="#0e0e12" stroke="#27272f"/>
<path d="M359 96v211" stroke="#292930"/>
${nestedArt}
<g clip-path="url(#t-artBounds)"><rect class="t-scan" x="44" y="98" width="290" height="32" fill="url(#t-scanGlow)"/></g>
<text class="t-human" x="396" y="128" fill="#f0f0f3" font-size="38" font-weight="600">LishayGFX</text>
<text class="t-human" x="397" y="164" fill="#92929e" font-size="18">github.com/LishayGFX</text>
<text class="t-human" x="397" y="194" fill="#858590" font-size="16">On GitHub since ${year}</text>
<path d="M397 219h541" stroke="#292930"/>
${counts.map((value, i) => `<text class="t-human" x="${397 + i * 190}" y="260" fill="#e8e8ee" font-size="28">${value}</text><text class="t-human" x="${397 + i * 190}" y="291" fill="#9999a4" font-size="15">${['Public repos', 'Repo stars', 'Followers'][i]}</text>`).join('')}
</g>

<g class="t-project">
<rect x="24" y="348" width="952" height="151" rx="5" fill="#0e0e12" stroke="#27272f"/>
<rect class="t-trace" x="24" y="348" width="952" height="151" rx="5" fill="none" stroke="#b8404d" stroke-width="1.2" pathLength="1000"/>
<path d="M24 385h952" stroke="#27272f"/>
<text class="t-human" x="44" y="373" fill="#bcbcc7" font-size="16">Projects</text>
<text class="t-human" x="44" y="427" fill="#efeff4" font-size="26">Atlas Survival</text>
<text class="t-human" x="44" y="460" fill="#a0a0ab" font-size="18">Official Minecraft resource pack releases.</text>
<path d="M932 416h16v16m0-16-23 23" stroke="#df4553" stroke-width="2" fill="none"/>
</g>

<g class="t-activity">
<rect x="24" y="517" width="952" height="218" rx="5" fill="#0e0e12" stroke="#27272f"/>
<path d="M24 554h952" stroke="#27272f"/>
<text class="t-human" x="44" y="542" fill="#bcbcc7" font-size="16">Activity</text>
<text class="t-human" x="954" y="542" text-anchor="end" fill="#90909c" font-size="14">Contribution calendar</text>
</g>
</g>
<g class="t-activity">${nestedSnake}</g>
<g class="t-text" font-size="13">
<text x="25" y="783" fill="#df4553">❯</text>
<g class="t-typing"><text x="43" y="783" fill="#a4a4b1">git status <tspan class="t-cursor" fill="#df4553">▍</tspan></text></g>
<text x="975" y="783" text-anchor="end" fill="#777783">Public data · ${date} UTC</text>
</g></svg>`;
await mkdir('assets', { recursive: true });
await writeFile('assets/terminal-art.svg', svg + '\n');
console.log(`Generated terminal profile from public data (${date} UTC)`);
