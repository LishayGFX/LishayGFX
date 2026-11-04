import { mkdir, writeFile } from 'node:fs/promises';

// Deliberately unauthenticated: these endpoints can only return public data.
const owner = 'LishayGFX';
async function get(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'LishayGFX-public-profile' },
  });
  if (!response.ok) throw new Error(`Public GitHub API returned ${response.status}`);
  return response.json();
}
const user = await get(`/users/${owner}`);
const repos = [];
for (let page = 1; ; page++) {
  const batch = await get(`/users/${owner}/repos?type=owner&per_page=100&page=${page}`);
  repos.push(...batch.filter(repo => repo.private === false && repo.owner.login.toLowerCase() === owner.toLowerCase()));
  if (batch.length < 100) break;
}
const values = [repos.length, repos.reduce((sum, repo) => sum + repo.stargazers_count, 0), user.followers];
if (values.some(value => !Number.isSafeInteger(value) || value < 0)) throw new Error('Invalid public metrics');
const labels = ['PUBLIC REPOS', 'PUBLIC REPO STARS', 'FOLLOWERS'];
const date = new Date().toISOString().slice(0, 10);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="108" viewBox="0 0 1000 108" role="img" aria-labelledby="title desc">
<title id="title">Public GitHub snapshot for ${owner}</title>
<desc id="desc">${labels.map((label, i) => `${label}: ${values[i]}`).join('; ')}. Updated ${date} UTC.</desc>
<path d="M0 1h1000" stroke="#242429"/>
<g font-family="Consolas,'Liberation Mono',monospace">${values.map((value, i) => `<text x="${i * 330}" y="42" fill="#dedee3" font-size="24">${value}<tspan fill="#77777f" font-size="12">  ${labels[i]}</tspan></text>`).join('')}
<text x="0" y="83" fill="#77777f" font-size="11">Updated ${date} UTC</text></g></svg>`;
await mkdir('assets', { recursive: true });
await writeFile('assets/metrics.svg', svg + '\n');
console.log(`Updated public snapshot: ${values.join(', ')} (${date} UTC)`);
