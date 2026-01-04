import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  fetchRatingsForWork,
  sortByMetacriticScore,
  type RatingResult,
} from "./ratings.ts";

// Allowed origins for CORS - restrict to known domains
const defaultAllowedOrigins = [
  'https://lovable.dev',
  'https://www.lovable.dev',
  'https://sylvainwinning.github.io',
  'https://qhvzrnelhsopzeosaqlx.supabase.co',
  'http://localhost:5173',
  'http://localhost:3000',
];

const envAllowedOrigins = Deno.env.get('ALLOWED_ORIGINS')?.split(',')
  .map(origin => origin.trim())
  .filter(Boolean) ?? [];

const allowedOrigins = [...defaultAllowedOrigins, ...envAllowedOrigins];
const normalizedAllowedOrigins = allowedOrigins.map(origin => origin.toLowerCase());

function getCorsHeaders(origin: string | null): Record<string, string> {
  const normalizedOrigin = origin?.toLowerCase() ?? null;
  const isAllowed = normalizedOrigin && normalizedAllowedOrigins.some(allowed =>
    normalizedOrigin === allowed ||
    normalizedOrigin.endsWith('.lovable.dev') ||
    normalizedOrigin.endsWith('.lovableproject.com')
  );

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

interface MediaItem {
  title: string;
  mediaType: string;
  status: string;
}

interface UserPreferences {
  general: string;
  directors: string[];
  actors: string[];
  music_genres: string[];
  game_preferences: string;
  book_preferences: string;
}

interface RequestBody {
  title: string;
  mediaType: string;
  platform?: string;
  preferences: UserPreferences;
  existingItems: MediaItem[];
}

interface RecommendationItem {
  rank: number;
  title: string;
  media_type: string;
  platform?: string | null;
  reason: string;
  metacritic?: RatingResult;
  senscritique?: RatingResult;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, mediaType, platform, preferences, existingItems }: RequestBody = await req.json();

    if (!title || !mediaType) {
      return new Response(
        JSON.stringify({ error: 'Titre et type requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Service temporairement indisponible' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context about user preferences
    const likedItems = existingItems.filter(i => i.status === 'aime').map(i => i.title).slice(0, 15);
    const dislikedItems = existingItems.filter(i => i.status === 'pas_aime').map(i => i.title).slice(0, 10);
    const watchlist = existingItems.filter(i => i.status === 'a_voir').map(i => i.title).slice(0, 10);
    const allItems = existingItems.map(i => i.title.toLowerCase());

    const mediaTypeLabels: Record<string, string> = {
      film: 'film',
      serie: 'série TV',
      jeu: 'jeu vidéo',
      livre: 'livre',
      musique: 'album/artiste musical',
    };

    const systemPrompt = `Tu es un expert en recommandation culturelle. Tu connais très bien les films, séries, jeux vidéo, livres et musiques.
Tu dois recommander des œuvres similaires basées sur les goûts de l'utilisateur.

RÈGLES STRICTES:
- Recommande EXACTEMENT 5 œuvres similaires du MÊME TYPE que l'œuvre analysée
- NE recommande JAMAIS une œuvre déjà dans les listes de l'utilisateur
- Classe les recommandations de la meilleure à la moins bonne selon la qualité générale
- Chaque justification doit faire 2 phrases MAXIMUM et être personnalisée selon les goûts de l'utilisateur
- Réponds UNIQUEMENT en JSON valide, sans markdown ni commentaires`;

    const userPrompt = `Œuvre à analyser: "${title}" (${mediaTypeLabels[mediaType] || mediaType})${platform ? ` sur ${platform}` : ''}

PROFIL UTILISATEUR:
- Préférences générales: ${preferences.general || 'Non spécifié'}
- Réalisateurs aimés: ${preferences.directors?.join(', ') || 'Non spécifié'}
- Acteurs aimés: ${preferences.actors?.join(', ') || 'Non spécifié'}
- Préférences jeux: ${preferences.game_preferences || 'Non spécifié'}
- Préférences livres: ${preferences.book_preferences || 'Non spécifié'}
- Genres musicaux: ${preferences.music_genres?.join(', ') || 'Non spécifié'}

ŒUVRES AIMÉES (à prendre en compte): ${likedItems.join(', ') || 'Aucune'}
ŒUVRES PAS AIMÉES (à éviter les similaires): ${dislikedItems.join(', ') || 'Aucune'}
DÉJÀ EN LISTE (NE PAS RECOMMANDER): ${allItems.join(', ') || 'Aucune'}

Génère 5 recommandations de ${mediaTypeLabels[mediaType] || mediaType} similaires à "${title}".

Réponds en JSON avec ce format EXACT:
{
  "query": {
    "title": "${title}",
    "media_type": "${mediaType}",
    "platform": ${platform ? `"${platform}"` : 'null'},
    "metacritic": {"source": "metacritic", "score": null, "url": null, "status": "not_found"},
    "senscritique": {"source": "senscritique", "score": null, "url": null, "status": "not_found"}
  },
  "recommendations": [
    {
      "rank": 1,
      "title": "Titre de l'œuvre",
      "media_type": "${mediaType}",
      "platform": ${mediaType === 'jeu' && platform ? `"${platform}"` : 'null'},
      "reason": "Justification courte en 2 phrases max basée sur les goûts.",
      "metacritic": {"source": "metacritic", "score": null, "url": null, "status": "not_found"},
      "senscritique": {"source": "senscritique", "score": null, "url": null, "status": "not_found"}
    }
  ]
}`;

    console.log('Calling Lovable AI for recommendations...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      // Log details server-side only for debugging
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      // Return generic error messages to client
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporairement indisponible.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Une erreur est survenue. Veuillez réessayer.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ error: 'Aucune recommandation générée. Veuillez réessayer.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (content.includes('```')) {
      jsonContent = content.replace(/```\n?/g, '');
    }

    try {
      const result = JSON.parse(jsonContent.trim());
      console.log('Recommendations generated successfully');

      const recommendations: RecommendationItem[] = Array.isArray(result.recommendations)
        ? result.recommendations.slice(0, 5)
        : [];

      const queryRatings = await fetchRatingsForWork({
        title,
        mediaType,
        platform: platform ?? null,
      });

      const enrichedRecommendations = await Promise.all(
        recommendations.map(async (rec, index) => {
          const ratings = await fetchRatingsForWork({
            title: rec.title,
            mediaType: rec.media_type,
            platform: rec.platform ?? null,
          });

          return {
            ...rec,
            rank: index + 1,
            platform: rec.platform ?? null,
            metacritic: ratings.metacritic,
            senscritique: ratings.senscritique,
          };
        }),
      );

      const sortedRecommendations = sortByMetacriticScore(enrichedRecommendations)
        .map((rec, index) => ({ ...rec, rank: index + 1 }));

      const responsePayload = {
        ...result,
        query: {
          ...(result.query || {}),
          title,
          media_type: mediaType,
          platform: platform ?? null,
          metacritic: queryRatings.metacritic,
          senscritique: queryRatings.senscritique,
        },
        recommendations: sortedRecommendations,
      };

      return new Response(
        JSON.stringify(responsePayload),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      // Log details server-side only
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors du traitement des recommandations.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    // Log details server-side only
    console.error('Error in get-recommendations:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue. Veuillez réessayer.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
