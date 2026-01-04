-- Default preferences now include curated values
ALTER TABLE public.profiles
  ALTER COLUMN preferences SET DEFAULT '{
    "general": "Fan de récits immersifs avec une tension psychologique, j\u0027adore les univers de science-fiction, les thrillers élégants et les histoires qui mêlent émotion et réflexion.",
    "directors": ["Christopher Nolan", "Denis Villeneuve", "Greta Gerwig", "Bong Joon-ho", "Hayao Miyazaki", "David Fincher", "Patty Jenkins"],
    "actors": ["Viola Davis", "Adam Driver", "Florence Pugh", "Oscar Isaac", "Zendaya", "Cillian Murphy", "Lupita Nyong'o"],
    "music_genres": ["Indie rock", "Synthwave", "Jazz contemporain", "Hip-hop conscient", "Classique piano", "Neo-soul"],
    "game_preferences": "Je privilégie les jeux narratifs avec des choix impactants et des mondes ouverts riches. Les RPG et action-aventure avec un bon rythme me plaisent, tant qu'ils ne sont pas punitifs.",
    "book_preferences": "J'aime la science-fiction humaniste, les thrillers psychologiques et les fresques historiques. Je préfère les romans bien rythmés avec des personnages travaillés."
  }'::jsonb;

-- Seed helper to prefill lists for anonymous profiles
CREATE OR REPLACE FUNCTION public.seed_anonymous_profile(profile_id uuid, skip_seed boolean DEFAULT false)
RETURNS void AS $$
BEGIN
  IF skip_seed THEN
    RETURN;
  END IF;

  INSERT INTO public.media_lists (profile_id, media_type, status, title, platform, notes)
  VALUES
    -- Films
    (profile_id, 'film', 'aime', 'Inception', NULL, NULL),
    (profile_id, 'film', 'aime', 'Arrival', NULL, NULL),
    (profile_id, 'film', 'aime', 'Mad Max: Fury Road', NULL, NULL),
    (profile_id, 'film', 'pas_aime', 'Suicide Squad (2016)', NULL, NULL),
    (profile_id, 'film', 'pas_aime', 'The Room', NULL, NULL),
    (profile_id, 'film', 'moyen', 'Batman v Superman: Dawn of Justice', NULL, NULL),
    (profile_id, 'film', 'a_voir', 'Dune: Part Two', NULL, NULL),
    (profile_id, 'film', 'a_voir', 'The Father', NULL, NULL),

    -- Séries
    (profile_id, 'serie', 'aime', 'Breaking Bad', NULL, NULL),
    (profile_id, 'serie', 'aime', 'Succession', NULL, NULL),
    (profile_id, 'serie', 'aime', 'Dark', NULL, NULL),
    (profile_id, 'serie', 'pas_aime', 'Emily in Paris', NULL, NULL),
    (profile_id, 'serie', 'pas_aime', 'Riverdale', NULL, NULL),
    (profile_id, 'serie', 'moyen', 'The Witcher', NULL, NULL),
    (profile_id, 'serie', 'a_voir', 'The Bear', NULL, NULL),
    (profile_id, 'serie', 'a_voir', 'Fargo', NULL, NULL),

    -- Jeux vidéo
    (profile_id, 'jeu', 'aime', 'The Witcher 3: Wild Hunt', 'PC', NULL),
    (profile_id, 'jeu', 'aime', 'God of War Ragnarök', 'PS5', NULL),
    (profile_id, 'jeu', 'aime', 'Hades', 'Switch', NULL),
    (profile_id, 'jeu', 'pas_aime', 'Battlefield 2042', 'PC', NULL),
    (profile_id, 'jeu', 'moyen', 'Elden Ring', 'PS5', NULL),
    (profile_id, 'jeu', 'a_voir', 'Baldur''s Gate 3', 'PC', NULL),
    (profile_id, 'jeu', 'a_voir', 'Starfield', 'Xbox', NULL),

    -- Livres
    (profile_id, 'livre', 'aime', 'Dune - Frank Herbert', NULL, NULL),
    (profile_id, 'livre', 'aime', 'La Horde du Contrevent - Alain Damasio', NULL, NULL),
    (profile_id, 'livre', 'aime', 'Millennium : Les Hommes qui n''aimaient pas les femmes - Stieg Larsson', NULL, NULL),
    (profile_id, 'livre', 'pas_aime', 'After - Anna Todd', NULL, NULL),
    (profile_id, 'livre', 'pas_aime', 'Cinquante nuances de Grey - E. L. James', NULL, NULL),
    (profile_id, 'livre', 'a_voir', 'Project Hail Mary - Andy Weir', NULL, NULL),
    (profile_id, 'livre', 'a_voir', 'Les Misérables - Victor Hugo', NULL, NULL),

    -- Musiques
    (profile_id, 'musique', 'aime', 'Random Access Memories - Daft Punk', NULL, NULL),
    (profile_id, 'musique', 'aime', 'To Pimp a Butterfly - Kendrick Lamar', NULL, NULL),
    (profile_id, 'musique', 'aime', 'In Rainbows - Radiohead', NULL, NULL),
    (profile_id, 'musique', 'pas_aime', 'Baby Shark - Pinkfong', NULL, NULL),
    (profile_id, 'musique', 'moyen', 'Stoney - Post Malone', NULL, NULL),
    (profile_id, 'musique', 'a_voir', 'Sauvage - Zaho de Sagazan', NULL, NULL),
    (profile_id, 'musique', 'a_voir', 'Actual Life 3 - Fred Again..', NULL, NULL);
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.seed_anonymous_profile(uuid, boolean) TO anon, authenticated;
