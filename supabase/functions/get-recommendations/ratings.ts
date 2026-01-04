export type RatingStatus = 'success' | 'not_found' | 'error';

export interface RatingResult {
  source: 'metacritic' | 'senscritique';
  score: number | null;
  url: string | null;
  status: RatingStatus;
}

export interface WorkIdentifier {
  title: string;
  mediaType: string;
  platform?: string | null;
}

const metacriticCategories: Record<string, string> = {
  film: 'movie',
  serie: 'tv',
  jeu: 'game',
  musique: 'album',
  livre: 'book',
};

const sensCritiqueCategories: Record<string, string> = {
  film: 'Films',
  serie: 'Series',
  jeu: 'Jeux',
  musique: 'Musiques',
  livre: 'Livres',
};

function normalizeScore(value: string | undefined | null): number | null {
  if (!value) return null;
  const numeric = parseFloat(value.replace(',', '.'));
  return Number.isFinite(numeric) ? numeric : null;
}

export function parseMetacriticUserScore(html: string): number | null {
  const patterns = [
    /metascore_w\s+user[^>]*>([0-9.]+)/i,
    /data-user="([0-9.]+)"/i,
    /User Score[^0-9]*([0-9.]+)/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    const score = normalizeScore(match?.[1]);
    if (score !== null) return score;
  }
  return null;
}

export function parseSensCritiqueUserScore(html: string): number | null {
  const patterns = [
    /data-testid="ratingValue"[^>]*>([0-9.,]+)/i,
    /elco-collection-item-user-rating[^>]*data-rating="([0-9.]+)\/?10?/i,
    /user-rating"[^>]*>([0-9.,]+)/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    const score = normalizeScore(match?.[1]);
    if (score !== null) return score;
  }
  return null;
}

function extractFirstRelativeUrl(html: string): string | null {
  const match = html.match(/href="(\/[a-z0-9\-_/]+)"/i);
  return match?.[1] ?? null;
}

async function fetchMetacritic(
  work: WorkIdentifier,
  fetchImpl: typeof fetch,
): Promise<RatingResult> {
  const category = metacriticCategories[work.mediaType] || 'movie';
  const searchQuery = encodeURIComponent(
    work.mediaType === 'jeu' && work.platform
      ? `${work.title} ${work.platform}`
      : work.title,
  );
  const url = `https://www.metacritic.com/search/${category}/${searchQuery}/results`;

  try {
    const response = await fetchImpl(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RecommendationBot/1.0)',
      },
    });

    if (!response.ok) {
      return { source: 'metacritic', score: null, url: null, status: 'error' };
    }

    const html = await response.text();
    const score = parseMetacriticUserScore(html);
    const relativeUrl = extractFirstRelativeUrl(html);

    if (score === null && !relativeUrl) {
      return { source: 'metacritic', score: null, url: null, status: 'not_found' };
    }

    return {
      source: 'metacritic',
      score,
      url: relativeUrl ? `https://www.metacritic.com${relativeUrl}` : null,
      status: score !== null ? 'success' : 'not_found',
    };
  } catch (error) {
    console.error('Metacritic fetch error', error);
    return { source: 'metacritic', score: null, url: null, status: 'error' };
  }
}

async function fetchSensCritique(
  work: WorkIdentifier,
  fetchImpl: typeof fetch,
): Promise<RatingResult> {
  const category = sensCritiqueCategories[work.mediaType] || 'Films';
  const searchQuery = encodeURIComponent(
    work.mediaType === 'jeu' && work.platform
      ? `${work.title} ${work.platform}`
      : work.title,
  );
  const url = `https://www.senscritique.com/search?query=${searchQuery}&categories=${category}`;

  try {
    const response = await fetchImpl(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RecommendationBot/1.0)',
      },
    });

    if (!response.ok) {
      return { source: 'senscritique', score: null, url: null, status: 'error' };
    }

    const html = await response.text();
    const score = parseSensCritiqueUserScore(html);
    const relativeUrl = extractFirstRelativeUrl(html);

    if (score === null && !relativeUrl) {
      return { source: 'senscritique', score: null, url: null, status: 'not_found' };
    }

    return {
      source: 'senscritique',
      score,
      url: relativeUrl ? `https://www.senscritique.com${relativeUrl}` : null,
      status: score !== null ? 'success' : 'not_found',
    };
  } catch (error) {
    console.error('SensCritique fetch error', error);
    return { source: 'senscritique', score: null, url: null, status: 'error' };
  }
}

export async function fetchRatingsForWork(
  work: WorkIdentifier,
  fetchImpl: typeof fetch = fetch,
): Promise<{ metacritic: RatingResult; senscritique: RatingResult }>
{
  const [metacritic, senscritique] = await Promise.all([
    fetchMetacritic(work, fetchImpl),
    fetchSensCritique(work, fetchImpl),
  ]);

  return { metacritic, senscritique };
}

export function sortByMetacriticScore<T extends { metacritic?: RatingResult }>(
  recommendations: T[],
): T[] {
  return recommendations
    .map((rec, index) => ({ rec, index }))
    .sort((a, b) => {
      const scoreA = a.rec.metacritic?.score ?? -1;
      const scoreB = b.rec.metacritic?.score ?? -1;
      if (scoreA === scoreB) return a.index - b.index;
      return scoreB - scoreA;
    })
    .map((entry) => entry.rec);
}
