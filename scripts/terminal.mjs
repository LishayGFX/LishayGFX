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
const projectRoot = `/repos/${owner}/${project.name}`;
const [releaseList, tree, packFile] = await Promise.all([
  get(`${projectRoot}/releases?per_page=20`),
  get(`${projectRoot}/git/trees/${encodeURIComponent(project.default_branch)}?recursive=1`),
  get(`${projectRoot}/contents/pack.mcmeta`),
]);
if (tree.truncated) throw new Error('Public project file listing is incomplete');
const latest = releaseList.find(release => !release.draft && !release.prerelease);
if (!latest) throw new Error('No public stable release available');
const asset = latest.assets.find(asset => asset.name.endsWith('.zip'));
const releaseDate = new Date(latest.published_at).toISOString().slice(0, 10);
const releaseName = escape(latest.tag_name.slice(0, 24));
const pack = JSON.parse(Buffer.from(packFile.content, 'base64').toString('utf8')).pack;
if (!Number.isSafeInteger(pack.pack_format)) throw new Error('Invalid pack format');
const pngCount = tree.tree.filter(file => file.type === 'blob' && file.path.endsWith('.png')).length;
const jsonCount = tree.tree.filter(file => file.type === 'blob' && file.path.endsWith('.json')).length;
const zipSize = asset ? `${Math.round(asset.size / 1024)} KB ZIP` : 'Release available';
const date = new Date().toISOString().slice(0, 10);
const year = new Date(user.created_at).getUTCFullYear();
if (!Number.isInteger(year)) throw new Error('Invalid account creation date');

const snake = await readFile('assets/snake.svg', 'utf8');
// The generated SVG is embedded, so the activity shares the same window.
// Refuse unexpected active content rather than injecting it into our asset.
if (!/^<svg\s/.test(snake) || /<(?:script|foreignObject|image|iframe)\b|\son\w+\s*=|(?:href|xlink:href)\s*=/i.test(snake)) {
  throw new Error('Unexpected contribution SVG content');
}
const nestedSnake = snake.replace('<svg ', '<svg x="42" y="825" width="916" height="171" ')
  .replace(/ width="880" height="192"/, '');
const art = await readFile('assets/ascii-knot.svg', 'utf8');
if (!/^<svg\s/.test(art) || /<(?:script|foreignObject|image|iframe)\b|\son\w+\s*=|(?:href|xlink:href)\s*=/i.test(art)) throw new Error('Unexpected artwork content');
const nestedArt = art.replace('width="384" height="256"', 'x="24" y="77" width="430" height="279"');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1060" viewBox="0 0 1000 1060" role="img" aria-labelledby="profileTitle profileDesc">
<title id="profileTitle">LishayGFX</title>
<desc id="profileDesc">Rotating ASCII torus knot from ASCII Magic. LishayGFX builds websites and apps, mostly through vibe coding. On GitHub since ${year}. ${counts[0]} public repositories, ${counts[1]} public repository stars, ${counts[2]} followers. Atlas Survival: ${escape(project.description || project.name)}. ${pngCount} PNG textures and ${jsonCount} JSON files. Pack format ${pack.pack_format}. Latest stable release ${releaseName}, published ${releaseDate}. Animated contribution calendar. Updated ${date} UTC.</desc>
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
<rect x="1" y="1" width="998" height="1058" rx="14" fill="#0e0e12" stroke="#33333a"/>
<rect x="2" y="2" width="996" height="1056" rx="13" fill="url(#grain)"/>
<path d="M15 1h970" stroke="#57505a" stroke-opacity="0.7"/>
<path d="M1 49h998M1 1017h998" stroke="#29292f"/>
<circle class="t-dot" cx="26" cy="25" r="4" fill="#df4553"/><circle cx="42" cy="25" r="4" fill="#45454d"/><circle cx="58" cy="25" r="4" fill="#45454d"/>
<g class="t-text">
<text x="86" y="31" fill="#9b9ba6" font-size="13">lishaygfx / profile</text>
<text x="958" y="31" text-anchor="end" fill="#777781" font-size="12">~/github</text>

<g class="t-info">
${nestedArt}
<g clip-path="url(#t-artBounds)"><rect class="t-scan" x="24" y="77" width="430" height="32" fill="url(#t-scanGlow)"/></g>
<text class="t-human" x="496" y="151" fill="#f2f2f5" font-size="49" font-weight="600">Lishay<tspan fill="#df6570">GFX</tspan></text>
<text class="t-human" x="498" y="191" fill="#b1b1be" font-size="19">Websites, apps &amp; vibe coding.</text>
<text class="t-human" x="498" y="223" fill="#868693" font-size="16">On GitHub since ${year}</text>
<path d="M498 249h460" stroke="#2c2c34"/>
${counts.map((value, i) => `<text class="t-human" x="${498 + i * 165}" y="288" fill="#e8e8ee" font-size="25">${value}</text><text class="t-human" x="${498 + i * 165}" y="318" fill="#a2a2ad" font-size="14">${['Public repos', 'Repo stars', 'Followers'][i]}</text>`).join('')}
</g>

<g class="t-project">
<path d="M42 362h916" stroke="#27272f"/>
<text class="t-human" x="42" y="397" fill="#c8c8d1" font-size="17">Projects</text>
<rect x="42" y="418" width="916" height="152" rx="8" fill="url(#t-card)" stroke="#302a30"/>
<rect class="t-trace" x="42" y="418" width="916" height="152" rx="8" fill="none" stroke="#b8404d" stroke-width="1.2" pathLength="1000"/>
<rect x="62" y="440" width="78" height="78" rx="8" fill="#20171c"/>
<path d="m77 468 24-14 24 14-24 14Zm0 0v24l24 14 24-14v-24m-24 14v24" fill="none" stroke="#d26873" stroke-width="1.7" stroke-linejoin="round"/>
<text class="t-human" x="164" y="469" fill="#efeff4" font-size="26">Atlas Survival</text>
<text class="t-human" x="164" y="502" fill="#a8a8b4" font-size="18">Custom rank tags, player tags &amp; hub billboards.</text>
<rect x="164" y="522" width="100" height="26" rx="13" fill="#282027"/><text class="t-human" x="214" y="540" text-anchor="middle" fill="#cdadb4" font-size="13">Minecraft</text>
<rect x="274" y="522" width="66" height="26" rx="13" fill="#222228"/><text class="t-human" x="307" y="540" text-anchor="middle" fill="#b4b4bf" font-size="13">JSON</text>
<rect x="350" y="522" width="60" height="26" rx="13" fill="#222228"/><text class="t-human" x="380" y="540" text-anchor="middle" fill="#b4b4bf" font-size="13">PNG</text>
<circle cx="917" cy="479" r="19" fill="#20171c"/>
<path d="M910 472h13v13m0-13-13 13" stroke="#df6570" stroke-width="1.7" fill="none"/>
</g>

<g class="t-activity">
<rect x="42" y="590" width="448" height="186" rx="8" fill="#111115" stroke="#282830"/>
<text class="t-human" x="64" y="623" fill="#c8c8d1" font-size="17">Inside Atlas</text>
<path d="M64 640h404" stroke="#292930"/>
<text class="t-human" x="64" y="672" fill="#9d9daa" font-size="16">PNG textures</text><text class="t-human" x="464" y="672" text-anchor="end" fill="#d8d8e1" font-size="17">${pngCount}</text>
<text class="t-human" x="64" y="711" fill="#9d9daa" font-size="16">JSON definitions</text><text class="t-human" x="464" y="711" text-anchor="end" fill="#d8d8e1" font-size="17">${jsonCount}</text>
<text class="t-human" x="64" y="750" fill="#9d9daa" font-size="16">Pack format</text><text class="t-human" x="464" y="750" text-anchor="end" fill="#d8d8e1" font-size="17">${pack.pack_format}</text>
<rect x="510" y="590" width="448" height="186" rx="8" fill="#111115" stroke="#282830"/>
<text class="t-human" x="532" y="623" fill="#c8c8d1" font-size="17">Latest release</text>
<circle class="t-dot" cx="930" cy="617" r="3" fill="#d26873"/>
<path d="M532 640h404" stroke="#292930"/>
<text class="t-human" x="532" y="680" fill="#efeff4" font-size="29">${releaseName}</text>
<text class="t-human" x="532" y="716" fill="#a8a8b4" font-size="16">${escape(zipSize)}</text>
<text class="t-human" x="532" y="750" fill="#91919e" font-size="15">Published ${releaseDate}</text>

<text class="t-human" x="42" y="817" fill="#c8c8d1" font-size="17">Activity</text>
<text class="t-human" x="958" y="817" text-anchor="end" fill="#90909c" font-size="14">Contribution calendar</text>
</g>
</g>
<g class="t-activity">${nestedSnake}</g>
<g class="t-text" font-size="13">
<text x="25" y="1043" fill="#df4553">❯</text>
<g class="t-typing"><text x="43" y="1043" fill="#a4a4b1">git status <tspan class="t-cursor" fill="#df4553">▍</tspan></text></g>
<text x="975" y="1043" text-anchor="end" fill="#878793">Public data · ${date} UTC</text>
</g></svg>`;
await mkdir('assets', { recursive: true });
await writeFile('assets/terminal-art.svg', svg + '\n');
console.log(`Generated terminal profile from public data (${date} UTC)`);
