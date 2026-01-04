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
Quentin Tarantino
Edgar Wright
Frères Coen
Jordan Peele
Ari Aster
Sam Esmail
`;

const rawActors = `
Joaquin Phoenix
Bo Burnham
Sacha Baron Cohen
Zach Braff
Frères Wayans
Simon Pegg
Steve Carell
Rami Malek
Christian Bale
Oscar Isaac
Tom Hardy
Ryan Gosling
Jesse Eisenberg
Shia LaBeouf
Bradley Cooper
Colin Farrell
Andy Samberg
`;

const rawMusicGenres = `
Rap français
Lorenzo
Lomepal
Nekfeu
Vald
Orelsan
Columbine
`;

export const defaultPreferences: UserPreferences = {
  general:
    "Je privilégie les expériences immersives : jeux à gameplay cinématographique et histoires captivantes, films/séries mêlant humour, horreur ou action, et rap français en fond sonore.",
  directors: normalizeList(rawDirectors),
  actors: normalizeList(rawActors),
  music_genres: normalizeList(rawMusicGenres),
  game_preferences:
    "Jeux linéaires avec progression simple, peu d'arbres de compétences, narration forte et graphismes réalistes.",
  book_preferences:
    "Romans originaux/technologiques, non-fiction concise et récits interactifs qui sortent de l'ordinaire.",
};

export const seededMediaItems: SeedMediaItem[] = [
  // Séries aimées
  { title: 'Bad Sisters', media_type: 'serie', status: 'aime' },
  { title: 'Better Call Saul', media_type: 'serie', status: 'aime' },
  { title: 'Big little lies', media_type: 'serie', status: 'aime' },
  { title: 'Black Bird', media_type: 'serie', status: 'aime' },
  { title: 'Black Mirror', media_type: 'serie', status: 'aime' },
  { title: 'Breaking Bad', media_type: 'serie', status: 'aime' },
  { title: 'Chernobyl', media_type: 'serie', status: 'aime' },
  { title: 'Constellation', media_type: 'serie', status: 'aime' },
  { title: 'Euphoria', media_type: 'serie', status: 'aime' },
  { title: 'Fallout', media_type: 'serie', status: 'aime' },
  { title: 'Game of Thrones', media_type: 'serie', status: 'aime' },
  { title: 'Gen V', media_type: 'serie', status: 'aime' },
  { title: 'House of the Dragon', media_type: 'serie', status: 'aime' },
  { title: 'La Flamme', media_type: 'serie', status: 'aime' },
  { title: 'Le Flambeau', media_type: 'serie', status: 'aime' },
  { title: 'Mindhunter', media_type: 'serie', status: 'aime' },
  { title: 'Mon petit renne', media_type: 'serie', status: 'aime' },
  { title: 'Mr. Robot', media_type: 'serie', status: 'aime' },
  { title: 'Nip/Tuck', media_type: 'serie', status: 'aime' },
  { title: 'Oz', media_type: 'serie', status: 'aime' },
  { title: 'Rick & Morty', media_type: 'serie', status: 'aime' },
  { title: 'Scrubs', media_type: 'serie', status: 'aime' },
  { title: 'Severance', media_type: 'serie', status: 'aime' },
  { title: 'Shōgun', media_type: 'serie', status: 'aime' },
  { title: 'Slow Horses', media_type: 'serie', status: 'aime' },
  { title: 'Squid Game', media_type: 'serie', status: 'aime' },
  { title: 'Stranger Things', media_type: 'serie', status: 'aime' },
  { title: 'Succession', media_type: 'serie', status: 'aime' },
  { title: 'The Boys', media_type: 'serie', status: 'aime' },
  { title: 'The Crowded Room', media_type: 'serie', status: 'aime' },
  { title: 'The Haunting of Hill House', media_type: 'serie', status: 'aime' },
  { title: 'The last of us', media_type: 'serie', status: 'aime' },
  { title: 'The White Lotus', media_type: 'serie', status: 'aime' },
  { title: 'The Wire', media_type: 'serie', status: 'aime' },
  { title: 'Westworld', media_type: 'serie', status: 'aime' },

  // Séries à voir
  { title: 'Barry', media_type: 'serie', status: 'a_voir' },
  { title: 'Curb your enthusiasm', media_type: 'serie', status: 'a_voir' },
  { title: 'Fleabag', media_type: 'serie', status: 'a_voir' },
  { title: 'House of cards', media_type: 'serie', status: 'a_voir' },
  { title: 'Le bureau des légendes', media_type: 'serie', status: 'a_voir' },
  { title: 'Madmen', media_type: 'serie', status: 'a_voir' },
  { title: 'Maniac', media_type: 'serie', status: 'a_voir' },
  { title: 'Misfits', media_type: 'serie', status: 'a_voir' },
  { title: 'Nathan For you', media_type: 'serie', status: 'a_voir' },
  { title: 'Peaky blinders', media_type: 'serie', status: 'a_voir' },
  { title: 'The Handmaid\'s Tale', media_type: 'serie', status: 'a_voir' },
  { title: 'The Leftovers', media_type: 'serie', status: 'a_voir' },
  { title: 'The penguin', media_type: 'serie', status: 'a_voir' },
  { title: 'True Detective', media_type: 'serie', status: 'a_voir' },
  { title: 'Utopia', media_type: 'serie', status: 'a_voir' },

  // Films aimés
  { title: '21 Jump Street', media_type: 'film', status: 'aime' },
  { title: '22 Jump Street', media_type: 'film', status: 'aime' },
  { title: 'Bullet Train', media_type: 'film', status: 'aime' },
  { title: 'Bugonia', media_type: 'film', status: 'aime' },
  { title: 'Deadpool (1,2&3)', media_type: 'film', status: 'aime' },
  { title: 'Get Out', media_type: 'film', status: 'aime' },
  { title: 'Hancock', media_type: 'film', status: 'aime' },
  { title: 'Her', media_type: 'film', status: 'aime' },
  { title: 'Hereditary', media_type: 'film', status: 'aime' },
  { title: 'Hot Fuzz', media_type: 'film', status: 'aime' },
  { title: 'John Wick (tous)', media_type: 'film', status: 'aime' },
  { title: 'Kick-Ass (1 & 2)', media_type: 'film', status: 'aime' },
  { title: 'Kingsman (1 & 2, Golden Circle)', media_type: 'film', status: 'aime' },
  { title: "L'amour ouf", media_type: 'film', status: 'aime' },
  { title: 'Logan', media_type: 'film', status: 'aime' },
  { title: 'Marvel (3 premières phases)', media_type: 'film', status: 'aime' },
  { title: 'Midsommar', media_type: 'film', status: 'aime' },
  { title: 'Mr. & Mrs. Smith', media_type: 'film', status: 'aime' },
  { title: 'Nobody', media_type: 'film', status: 'aime' },
  { title: 'Prisoners', media_type: 'film', status: 'aime' },
  { title: 'RED', media_type: 'film', status: 'aime' },
  { title: 'Shaun of the Dead', media_type: 'film', status: 'aime' },
  { title: 'The Hangover', media_type: 'film', status: 'aime' },
  { title: 'The Nice Guys', media_type: 'film', status: 'aime' },
  { title: 'The Other Guys', media_type: 'film', status: 'aime' },
  { title: 'The Prestige', media_type: 'film', status: 'aime' },
  { title: 'The Wolverine', media_type: 'film', status: 'aime' },
  { title: 'This Is the End', media_type: 'film', status: 'aime' },
  { title: 'Tropic Thunder', media_type: 'film', status: 'aime' },
  { title: 'Uncut Gems', media_type: 'film', status: 'aime' },
  { title: 'We’re the Millers', media_type: 'film', status: 'aime' },
  { title: 'X-Men (tous)', media_type: 'film', status: 'aime' },
  { title: 'Zombieland', media_type: 'film', status: 'aime' },

  // Films pas appréciés
  { title: '9 mois ferme', media_type: 'film', status: 'pas_aime' },
  { title: 'Adieu les cons', media_type: 'film', status: 'pas_aime' },
  { title: 'All inclusive', media_type: 'film', status: 'pas_aime' },
  { title: 'Ant-Man and the Wasp', media_type: 'film', status: 'pas_aime' },
  { title: 'Birdman', media_type: 'film', status: 'pas_aime' },
  { title: 'Comment tuer son boss ?', media_type: 'film', status: 'pas_aime' },
  { title: 'Esther', media_type: 'film', status: 'pas_aime' },
  { title: 'Ju-on : the grudge', media_type: 'film', status: 'pas_aime' },
  { title: 'La fugue', media_type: 'film', status: 'pas_aime' },
  { title: 'Night moves', media_type: 'film', status: 'pas_aime' },
  { title: 'Nosferatu (2024)', media_type: 'film', status: 'pas_aime' },
  { title: 'Only god forgives', media_type: 'film', status: 'pas_aime' },
  { title: 'Venom', media_type: 'film', status: 'pas_aime' },

  // Jeux aimés
  { title: 'Call of Duty (tous)', media_type: 'jeu', status: 'aime' },
  { title: 'Cyberpunk 2077', media_type: 'jeu', status: 'aime' },
  { title: 'Death Stranding 1 & 2', media_type: 'jeu', status: 'aime' },
  { title: 'Detroit : Become Human', media_type: 'jeu', status: 'aime' },
  { title: 'Ghost of Tsushima', media_type: 'jeu', status: 'aime' },
  { title: 'Ghost of Yotei', media_type: 'jeu', status: 'aime' },
  { title: 'God of War Ragnarök', media_type: 'jeu', status: 'aime' },
  { title: 'GTA (tous)', media_type: 'jeu', status: 'aime' },
  { title: 'It Takes Two', media_type: 'jeu', status: 'aime' },
  { title: 'Red Dead Redemption 2', media_type: 'jeu', status: 'aime' },
  { title: 'Rocket League', media_type: 'jeu', status: 'aime' },
  { title: 'The Last of Us (Part I & II)', media_type: 'jeu', status: 'aime' },
  { title: 'The Witcher 3', media_type: 'jeu', status: 'aime' },
  { title: 'Uncharted 4', media_type: 'jeu', status: 'aime' },
  { title: 'Watch Dogs (tous)', media_type: 'jeu', status: 'aime' },
  { title: 'Worms', media_type: 'jeu', status: 'aime' },

  // Jeux moyennement appréciés
  { title: 'Metal Gear Solid Δ : Snake Eater', media_type: 'jeu', status: 'moyen' },
  { title: 'Stray', media_type: 'jeu', status: 'moyen' },

  // Jeux pas appréciés
  { title: "Assassin’s Creed Mirage", media_type: 'jeu', status: 'pas_aime' },
  { title: 'Final Fantasy', media_type: 'jeu', status: 'pas_aime' },
  { title: 'Halo', media_type: 'jeu', status: 'pas_aime' },
  { title: 'Horizon Forbidden West', media_type: 'jeu', status: 'pas_aime' },
  { title: 'Horizon Zero Dawn', media_type: 'jeu', status: 'pas_aime' },
  { title: 'Spider-Man 2', media_type: 'jeu', status: 'pas_aime' },
  { title: 'Spider-Man : Miles Morales', media_type: 'jeu', status: 'pas_aime' },
  { title: 'Titanfall 2', media_type: 'jeu', status: 'pas_aime' },

  // Jeux à jouer
  { title: 'Beyond : Two Souls', media_type: 'jeu', status: 'a_voir' },
  { title: 'Black Myth : Wukong', media_type: 'jeu', status: 'a_voir' },
  { title: 'Days Gone', media_type: 'jeu', status: 'a_voir' },
  { title: 'Erica', media_type: 'jeu', status: 'a_voir' },
  { title: 'Far Cry 6', media_type: 'jeu', status: 'a_voir' },
  { title: 'Heavy Rain', media_type: 'jeu', status: 'a_voir' },
  { title: 'Metro Exodus', media_type: 'jeu', status: 'a_voir' },
  { title: 'Star Wars Jedi : Fallen Order', media_type: 'jeu', status: 'a_voir' },
  { title: 'The Division 2', media_type: 'jeu', status: 'a_voir' },
  { title: 'Until Dawn', media_type: 'jeu', status: 'a_voir' },
  { title: 'Control', media_type: 'jeu', status: 'a_voir', notes: 'Prochain jeu' },
  { title: 'Battlefield', media_type: 'jeu', status: 'a_voir', notes: 'Ensuite à jouer' },

  // Livres à lire
  { title: 'Le vieux qui ne voulait pas fêter son anniversaire', media_type: 'livre', status: 'a_voir' },
  { title: "Le cercle littéraire des amateurs d’épluchures de patates", media_type: 'livre', status: 'a_voir' },
  { title: 'God Save la France', media_type: 'livre', status: 'a_voir' },
  { title: 'La Cantatrice chauve', media_type: 'livre', status: 'a_voir' },
  { title: 'Rhinocéros', media_type: 'livre', status: 'a_voir' },
  { title: 'Le chameau sauvage', media_type: 'livre', status: 'a_voir' },
  { title: 'Les brutes', media_type: 'livre', status: 'a_voir' },
  { title: 'Les meufs c’est des mecs bien', media_type: 'livre', status: 'a_voir' },
  { title: 'L’intelligence artificielle n’existe pas', media_type: 'livre', status: 'a_voir' },
  { title: 'A Technique for Producing Ideas', media_type: 'livre', status: 'a_voir' },
  { title: 'Les origines', media_type: 'livre', status: 'a_voir' },
  { title: 'Don’t Make Me Think', media_type: 'livre', status: 'a_voir' },
  { title: 'L’Art de la Guerre', media_type: 'livre', status: 'a_voir' },
  { title: 'L’art subtil de s’en foutre', media_type: 'livre', status: 'a_voir' },
  { title: 'Votre empire dans un sac-à-dos', media_type: 'livre', status: 'a_voir' },
  { title: 'Les Clés du Product Management', media_type: 'livre', status: 'a_voir' },
  { title: 'Death Escape : fais tes choix, tu es filmé !', media_type: 'livre', status: 'a_voir' },
  { title: 'Le Médaillon d’Orion', media_type: 'livre', status: 'a_voir' },
  { title: 'L’homme qui sauva le monde', media_type: 'livre', status: 'a_voir' },

  // Livres déjà lus et appréciés
  { title: 'Vous pouvez être ce que vous voulez être', media_type: 'livre', status: 'aime' },
  { title: 'You had better make some noise', media_type: 'livre', status: 'aime' },
  { title: 'L’Amour, c’est surcoté', media_type: 'livre', status: 'aime' },

  // Musiques aimées (artistes)
  { title: 'Lorenzo', media_type: 'musique', status: 'aime' },
  { title: 'Lomepal', media_type: 'musique', status: 'aime' },
  { title: 'Nekfeu', media_type: 'musique', status: 'aime' },
  { title: 'Vald', media_type: 'musique', status: 'aime' },
  { title: 'Orelsan', media_type: 'musique', status: 'aime' },
  { title: 'Columbine', media_type: 'musique', status: 'aime' },
];
