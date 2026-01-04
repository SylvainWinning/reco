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
Christopher Nolan
Denis Villeneuve
Greta Gerwig
Bong Joon-ho
Hayao Miyazaki
David Fincher
Patty Jenkins
`; 

const rawActors = `
Viola Davis
Adam Driver
Florence Pugh
Oscar Isaac
Zendaya
Cillian Murphy
Lupita Nyong'o
`; 

const rawMusicGenres = `
Indie rock
Synthwave
Jazz contemporain
Hip-hop conscient
Classique piano
Neo-soul
`;

export const defaultPreferences: UserPreferences = {
  general:
    "Fan de récits immersifs avec une tension psychologique, j'adore les univers de science-fiction, les thrillers élégants et les histoires qui mêlent émotion et réflexion.",
  directors: normalizeList(rawDirectors),
  actors: normalizeList(rawActors),
  music_genres: normalizeList(rawMusicGenres),
  game_preferences:
    "Je privilégie les jeux narratifs avec des choix impactants et des mondes ouverts riches. Les RPG et action-aventure avec un bon rythme me plaisent, tant qu'ils ne sont pas punitifs.",
  book_preferences:
    "J'aime la science-fiction humaniste, les thrillers psychologiques et les fresques historiques. Je préfère les romans bien rythmés avec des personnages travaillés.",
};

export const seededMediaItems: SeedMediaItem[] = [
  // Films
  { title: 'Inception', media_type: 'film', status: 'aime' },
  { title: 'Arrival', media_type: 'film', status: 'aime' },
  { title: 'Mad Max: Fury Road', media_type: 'film', status: 'aime' },
  { title: 'Suicide Squad (2016)', media_type: 'film', status: 'pas_aime' },
  { title: 'The Room', media_type: 'film', status: 'pas_aime' },
  { title: 'Batman v Superman: Dawn of Justice', media_type: 'film', status: 'moyen' },
  { title: 'Dune: Part Two', media_type: 'film', status: 'a_voir' },
  { title: 'The Father', media_type: 'film', status: 'a_voir' },

  // Séries
  { title: 'Breaking Bad', media_type: 'serie', status: 'aime' },
  { title: 'Succession', media_type: 'serie', status: 'aime' },
  { title: 'Dark', media_type: 'serie', status: 'aime' },
  { title: 'Emily in Paris', media_type: 'serie', status: 'pas_aime' },
  { title: 'Riverdale', media_type: 'serie', status: 'pas_aime' },
  { title: 'The Witcher', media_type: 'serie', status: 'moyen' },
  { title: 'The Bear', media_type: 'serie', status: 'a_voir' },
  { title: 'Fargo', media_type: 'serie', status: 'a_voir' },

  // Jeux vidéo
  { title: 'The Witcher 3: Wild Hunt', media_type: 'jeu', status: 'aime', platform: 'PC' },
  { title: 'God of War Ragnarök', media_type: 'jeu', status: 'aime', platform: 'PS5' },
  { title: 'Hades', media_type: 'jeu', status: 'aime', platform: 'Switch' },
  { title: 'Battlefield 2042', media_type: 'jeu', status: 'pas_aime', platform: 'PC' },
  { title: 'Elden Ring', media_type: 'jeu', status: 'moyen', platform: 'PS5' },
  { title: 'Baldur\'s Gate 3', media_type: 'jeu', status: 'a_voir', platform: 'PC' },
  { title: 'Starfield', media_type: 'jeu', status: 'a_voir', platform: 'Xbox' },

  // Livres
  { title: 'Dune - Frank Herbert', media_type: 'livre', status: 'aime' },
  { title: 'La Horde du Contrevent - Alain Damasio', media_type: 'livre', status: 'aime' },
  { title: "Millennium : Les Hommes qui n'aimaient pas les femmes - Stieg Larsson", media_type: 'livre', status: 'aime' },
  { title: 'After - Anna Todd', media_type: 'livre', status: 'pas_aime' },
  { title: 'Cinquante nuances de Grey - E. L. James', media_type: 'livre', status: 'pas_aime' },
  { title: 'Project Hail Mary - Andy Weir', media_type: 'livre', status: 'a_voir' },
  { title: 'Les Misérables - Victor Hugo', media_type: 'livre', status: 'a_voir' },

  // Musiques (albums / artistes)
  { title: 'Random Access Memories - Daft Punk', media_type: 'musique', status: 'aime' },
  { title: 'To Pimp a Butterfly - Kendrick Lamar', media_type: 'musique', status: 'aime' },
  { title: 'In Rainbows - Radiohead', media_type: 'musique', status: 'aime' },
  { title: 'Baby Shark - Pinkfong', media_type: 'musique', status: 'pas_aime' },
  { title: 'Stoney - Post Malone', media_type: 'musique', status: 'moyen' },
  { title: 'Sauvage - Zaho de Sagazan', media_type: 'musique', status: 'a_voir' },
  { title: 'Actual Life 3 - Fred Again..', media_type: 'musique', status: 'a_voir' },
];
