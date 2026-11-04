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
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="180" viewBox="0 0 900 180" role="img" aria-labelledby="title desc">
<title id="title">Public GitHub snapshot for ${owner}</title>
<desc id="desc">${labels.map((label, i) => `${label}: ${values[i]}`).join('; ')}. Updated ${date} UTC.</desc>
<rect x="1" y="1" width="898" height="178" rx="14" fill="#101014" stroke="#303039"/>
<g font-family="ui-monospace,Consolas,monospace">${values.map((value, i) => `<text x="${38 + i * 295}" y="44" fill="#aaaab8" font-size="12">${labels[i]}</text><text x="${38 + i * 295}" y="104" fill="#f04458" font-size="42" font-weight="700">${value}</text>`).join('')}
<path d="M38 127h824" stroke="#303039"/><text x="38" y="155" fill="#888895" font-size="11">PUBLIC API SNAPSHOT · ${date} UTC · REFRESHED DAILY</text></g></svg>`;
await mkdir('assets', { recursive: true });
await writeFile('assets/public-stats.svg', svg + '\n');
console.log(`Updated public snapshot: ${values.join(', ')} (${date} UTC)`);
