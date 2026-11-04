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
const mark = [
  '██       ██████ ',
  '██      ██      ',
  '██      ██      ',
  '██      ██  ███ ',
  '██      ██   ██ ',
  '██      ██   ██ ',
  '██████   █████  ',
];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="800" viewBox="0 0 1000 800" role="img" aria-labelledby="profileTitle profileDesc">
<title id="profileTitle">LishayGFX</title>
<desc id="profileDesc">LG ASCII mark. LishayGFX, on GitHub since ${year}. ${counts[0]} public repositories, ${counts[1]} public repository stars, ${counts[2]} followers. Atlas Survival: ${escape(project.description || project.name)}. Animated contribution calendar. Updated ${date} UTC.</desc>
<defs><pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.5" fill="#ffffff" opacity="0.025"/></pattern></defs>
<style>
.t-text{font-family:Consolas,'Liberation Mono',monospace}
.t-cursor{animation:t-blink 1.1s step-end 6}
.t-mark{animation:t-reveal 1.5s steps(7,end) both}
@keyframes t-blink{50%{opacity:0}}
@keyframes t-reveal{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0 0)}}
@media(prefers-reduced-motion:reduce){.t-cursor,.t-mark,.c,.s,.u{animation:none!important}}
</style>
<rect x="1" y="1" width="998" height="798" rx="12" fill="#0b0b0e" stroke="#303036"/>
<rect x="2" y="2" width="996" height="796" rx="11" fill="url(#grain)"/>
<path d="M1 49h998M1 755h998" stroke="#29292f"/>
<circle cx="26" cy="25" r="4" fill="#df4553"/><circle cx="42" cy="25" r="4" fill="#45454d"/><circle cx="58" cy="25" r="4" fill="#45454d"/>
<g class="t-text">
<text x="500" y="31" text-anchor="middle" fill="#90909b" font-size="14">lishaygfx@github: ~</text>
<text x="956" y="31" text-anchor="end" fill="#5c5c68" font-size="12">zsh</text>

<rect x="24" y="73" width="952" height="257" rx="5" fill="#0e0e12" stroke="#27272f"/>
<path d="M359 96v211" stroke="#292930"/>
<g class="t-mark" fill="#df4553" font-size="24" xml:space="preserve">${mark.map((line, i) => `<text x="60" y="${127 + i * 23}">${line}</text>`).join('')}</g>
<text x="396" y="128" fill="#f0f0f3" font-size="35" font-weight="700" letter-spacing="-1.5">LishayGFX</text>
<text x="397" y="164" fill="#92929e" font-size="16">github.com/LishayGFX</text>
<text x="397" y="194" fill="#757580" font-size="14">On GitHub since ${year}</text>
<path d="M397 219h541" stroke="#292930"/>
${counts.map((value, i) => `<text x="${397 + i * 190}" y="260" fill="#e8e8ee" font-size="27">${value}</text><text x="${397 + i * 190}" y="291" fill="#888894" font-size="12">${['Public repos', 'Repo stars', 'Followers'][i]}</text>`).join('')}

<rect x="24" y="348" width="952" height="151" rx="5" fill="#0e0e12" stroke="#27272f"/>
<path d="M24 385h952" stroke="#27272f"/>
<text x="44" y="373" fill="#bcbcc7" font-size="14">Projects</text>
<text x="44" y="427" fill="#efeff4" font-size="23">Atlas Survival</text>
<text x="44" y="460" fill="#93939f" font-size="16">Official Minecraft resource pack releases.</text>
<path d="M932 416h16v16m0-16-23 23" stroke="#df4553" stroke-width="2" fill="none"/>

<rect x="24" y="517" width="952" height="218" rx="5" fill="#0e0e12" stroke="#27272f"/>
<path d="M24 554h952" stroke="#27272f"/>
<text x="44" y="542" fill="#bcbcc7" font-size="14">Activity</text>
<text x="954" y="542" text-anchor="end" fill="#777783" font-size="12">Contribution calendar</text>
</g>
${nestedSnake}
<g class="t-text" font-size="13">
<text x="25" y="783" fill="#a4a4b1"><tspan fill="#df4553">❯</tspan> <tspan class="t-cursor" fill="#df4553">▍</tspan></text>
<text x="975" y="783" text-anchor="end" fill="#777783">Public data · ${date} UTC</text>
</g></svg>`;
await mkdir('assets', { recursive: true });
await writeFile('assets/profile-window.svg', svg + '\n');
console.log(`Generated terminal profile from public data (${date} UTC)`);
