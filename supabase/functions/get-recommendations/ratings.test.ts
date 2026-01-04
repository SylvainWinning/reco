import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { assert } from "https://deno.land/std@0.224.0/assert/assert.ts";
import {
  fetchRatingsForWork,
  parseMetacriticUserScore,
  parseSensCritiqueUserScore,
  sortByMetacriticScore,
  type RatingResult,
} from "./ratings.ts";

Deno.test('parseMetacriticUserScore privilégie le user score', () => {
  const html = `
    <div class="metascore_w header_size movie positive">91</div>
    <div class="metascore_w user larger">7.5</div>
  `;

  const score = parseMetacriticUserScore(html);
  assertEquals(score, 7.5);
});

Deno.test('parseSensCritiqueUserScore récupère la note utilisateur', () => {
  const html = `
    <span class="elco-collection-item-user-rating" data-rating="8.2/10"></span>
  `;

  const score = parseSensCritiqueUserScore(html);
  assertEquals(score, 8.2);
});

Deno.test('sortByMetacriticScore trie par note décroissante en conservant l\'ordre sinon', () => {
  const recs: Array<{ id: string; metacritic: RatingResult }> = [
    { id: 'a', metacritic: { source: 'metacritic', score: 7, url: null, status: 'success' } },
    { id: 'b', metacritic: { source: 'metacritic', score: null, url: null, status: 'not_found' } },
    { id: 'c', metacritic: { source: 'metacritic', score: 9.2, url: null, status: 'success' } },
  ];

  const sorted = sortByMetacriticScore(recs);

  assertEquals(sorted.map((r) => r.id), ['c', 'a', 'b']);
});

Deno.test('fetchRatingsForWork signale une erreur réseau sans lancer d\'exception', async () => {
  const failingFetch = () => Promise.reject(new Error('network failure')) as unknown as ReturnType<typeof fetch>;

  const ratings = await fetchRatingsForWork({ title: 'Test', mediaType: 'film' }, failingFetch);

  assert(ratings.metacritic.status === 'error');
  assert(ratings.senscritique.status === 'error');
});
