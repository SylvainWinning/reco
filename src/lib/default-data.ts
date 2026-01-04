import { GamingPlatform, ListStatus, MediaType, UserPreferences } from './types';

const normalizeList = (input: string): string[] =>
  input
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean);

type SeedMediaItem = {
  title: string;
  media_type: MediaType;
  status: ListStatus;
  platform?: GamingPlatform | null;
  notes?: string | null;
};

const rawDirectors = `
Denis Villeneuve
Céline Sciamma
Alfonso Cuarón
Greta Gerwig
Bong Joon-ho
Hayao Miyazaki
David Fincher
`;

const rawActors = `
Adam Driver
Florence Pugh
Zendaya
Cillian Murphy
Lupita Nyong'o
Adèle Exarchopoulos
Oscar Isaac
`;

const rawMusicGenres = `
Rap français
Neo-soul
Electro chill
Jazz fusion
Pop alternative
Bandes originales de films
`;

export const defaultPreferences: UserPreferences = {
  general:
    "Fan de jeux solo linéaires et de récits immersifs, j'adore les thrillers élégants, la science-fiction sensible et les histoires qui mêlent émotion et tension psychologique.",
  directors: normalizeList(rawDirectors),
  actors: normalizeList(rawActors),
  music_genres: normalizeList(rawMusicGenres),
  game_preferences:
    "Je privilégie les expériences narratives sans grind inutile, avec une mise en scène cinématographique et des choix impactants. Les jeux d'action-aventure et les RPG très scénarisés sont mes coups de cœur.",
  book_preferences:
    "Je recherche des romans de science-fiction humaniste ou de thrillers tendus, avec un rythme maîtrisé et des personnages travaillés. Les uchronies et les fresques d'anticipation me captivent particulièrement.",
};

export const seededMediaItems: SeedMediaItem[] = [
  // Films
  { title: 'Interstellar', media_type: 'film', status: 'aime' },
  { title: 'Dune: Part One', media_type: 'film', status: 'aime' },
  { title: 'Whiplash', media_type: 'film', status: 'aime' },
  { title: 'Portrait de la jeune fille en feu', media_type: 'film', status: 'aime' },
  { title: 'Morbius', media_type: 'film', status: 'pas_aime' },
  { title: 'Cats (2019)', media_type: 'film', status: 'pas_aime' },
  { title: 'The Killer', media_type: 'film', status: 'a_voir' },
  { title: 'Past Lives', media_type: 'film', status: 'a_voir' },

  // Séries
  { title: 'The Leftovers', media_type: 'serie', status: 'aime' },
  { title: 'Chernobyl', media_type: 'serie', status: 'aime' },
  { title: 'Arcane', media_type: 'serie', status: 'aime' },
  { title: 'Emily in Paris', media_type: 'serie', status: 'pas_aime' },
  { title: 'The Idol', media_type: 'serie', status: 'pas_aime' },
  { title: 'Severance', media_type: 'serie', status: 'a_voir' },
  { title: 'Shōgun', media_type: 'serie', status: 'a_voir' },

  // Jeux vidéo
  { title: 'The Last of Us Part I', media_type: 'jeu', status: 'aime', platform: 'PS5' },
  { title: "Uncharted 4: A Thief's End", media_type: 'jeu', status: 'aime', platform: 'PS5' },
  { title: 'Ori and the Will of the Wisps', media_type: 'jeu', status: 'aime', platform: 'PC' },
  { title: "Assassin's Creed Mirage", media_type: 'jeu', status: 'pas_aime', platform: 'PC' },
  { title: 'The Elder Scrolls V: Skyrim', media_type: 'jeu', status: 'pas_aime', platform: 'PC' },
  { title: 'A Plague Tale: Requiem', media_type: 'jeu', status: 'a_voir', platform: 'PC' },
  { title: 'Alan Wake 2', media_type: 'jeu', status: 'a_voir', platform: 'PS5' },

  // Livres
  { title: 'Hyperion - Dan Simmons', media_type: 'livre', status: 'aime' },
  { title: 'Le Problème à trois corps - Liu Cixin', media_type: 'livre', status: 'aime' },
  { title: "L'Anomalie - Hervé Le Tellier", media_type: 'livre', status: 'aime' },
  { title: 'After - Anna Todd', media_type: 'livre', status: 'pas_aime' },
  { title: 'Twilight - Stephenie Meyer', media_type: 'livre', status: 'pas_aime' },
  { title: 'Les Furtifs - Alain Damasio', media_type: 'livre', status: 'a_voir' },
  { title: 'Le Maître du Haut Château - Philip K. Dick', media_type: 'livre', status: 'a_voir' },

  // Musiques (albums / artistes)
  { title: 'Civilisation - Orelsan', media_type: 'musique', status: 'aime' },
  { title: 'Feu - Nekfeu', media_type: 'musique', status: 'aime' },
  { title: 'Multitude - Stromae', media_type: 'musique', status: 'aime' },
  { title: 'Baby Shark - Pinkfong', media_type: 'musique', status: 'pas_aime' },
  { title: 'Harlem Shake - Baauer', media_type: 'musique', status: 'pas_aime' },
  { title: 'Mauvais Ordre - Lomepal', media_type: 'musique', status: 'a_voir' },
  { title: 'Géopoétique - MC Solaar', media_type: 'musique', status: 'a_voir' },
];
