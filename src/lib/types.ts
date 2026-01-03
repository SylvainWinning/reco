export type MediaType = 'film' | 'serie' | 'jeu' | 'livre' | 'musique';
export type ListStatus = 'aime' | 'moyen' | 'pas_aime' | 'a_voir';
export type GamingPlatform = 'PS5' | 'PS4' | 'PC' | 'Xbox' | 'Switch';

export interface UserPreferences {
  general: string;
  directors: string[];
  actors: string[];
  music_genres: string[];
  game_preferences: string;
  book_preferences: string;
}

export interface MediaItem {
  id: string;
  profile_id: string;
  media_type: MediaType;
  status: ListStatus;
  title: string;
  platform?: GamingPlatform | null;
  notes?: string | null;
  created_at: string;
}

export interface Rating {
  source: 'senscritique' | 'metacritic';
  score: number | null;
  url: string | null;
  status: 'found' | 'not_found' | 'error';
}

export interface Recommendation {
  rank: number;
  title: string;
  media_type: MediaType;
  platform?: GamingPlatform | null;
  reason: string;
  metacritic: Rating;
  senscritique: Rating;
}

export interface AnalysisResult {
  query: {
    title: string;
    media_type: MediaType;
    platform?: GamingPlatform | null;
    metacritic: Rating;
    senscritique: Rating;
  };
  recommendations: Recommendation[];
}

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  film: 'Film',
  serie: 'Série',
  jeu: 'Jeu vidéo',
  livre: 'Livre',
  musique: 'Musique',
};

export const MEDIA_TYPE_ICONS: Record<MediaType, string> = {
  film: '🎬',
  serie: '📺',
  jeu: '🎮',
  livre: '📚',
  musique: '🎵',
};

export const LIST_STATUS_LABELS: Record<ListStatus, string> = {
  aime: 'Aimés',
  moyen: 'Moyennement aimés',
  pas_aime: 'Pas aimés',
  a_voir: 'À voir / À jouer / À lire',
};

export const GAMING_PLATFORMS: GamingPlatform[] = ['PS5', 'PS4', 'PC', 'Xbox', 'Switch'];
