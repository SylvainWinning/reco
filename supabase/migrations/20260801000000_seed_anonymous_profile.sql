-- Default preferences now include curated values
ALTER TABLE public.profiles
  ALTER COLUMN preferences SET DEFAULT '{
    "general": "Fan de jeux solo linéaires et de récits immersifs, j\u0027adore les thrillers élégants, la science-fiction sensible et les histoires qui mêlent émotion et tension psychologique.",
    "directors": ["Denis Villeneuve", "Céline Sciamma", "Alfonso Cuarón", "Greta Gerwig", "Bong Joon-ho", "Hayao Miyazaki", "David Fincher"],
    "actors": ["Adam Driver", "Florence Pugh", "Zendaya", "Cillian Murphy", "Lupita Nyong'o", "Adèle Exarchopoulos", "Oscar Isaac"],
    "music_genres": ["Rap français", "Neo-soul", "Electro chill", "Jazz fusion", "Pop alternative", "Bandes originales de films"],
    "game_preferences": "Je privilégie les expériences narratives sans grind inutile, avec une mise en scène cinématographique et des choix impactants. Les jeux d'action-aventure et les RPG très scénarisés sont mes coups de cœur.",
    "book_preferences": "Je recherche des romans de science-fiction humaniste ou de thrillers tendus, avec un rythme maîtrisé et des personnages travaillés. Les uchronies et les fresques d'anticipation me captivent particulièrement."
  }'::jsonb;

-- Seed helper to prefill lists for anonymous profiles
CREATE OR REPLACE FUNCTION public.seed_anonymous_profile(p_profile_id uuid, skip_seed boolean DEFAULT false)
RETURNS void AS $$
BEGIN
  IF skip_seed THEN
    RETURN;
  END IF;

  IF EXISTS (SELECT 1 FROM public.media_lists WHERE profile_id = p_profile_id LIMIT 1) THEN
    RETURN;
  END IF;

  INSERT INTO public.media_lists (profile_id, media_type, status, title, platform, notes)
  VALUES
    -- Films
    (p_profile_id, 'film', 'aime', 'Interstellar', NULL, NULL),
    (p_profile_id, 'film', 'aime', 'Dune: Part One', NULL, NULL),
    (p_profile_id, 'film', 'aime', 'Whiplash', NULL, NULL),
    (p_profile_id, 'film', 'aime', 'Portrait de la jeune fille en feu', NULL, NULL),
    (p_profile_id, 'film', 'pas_aime', 'Morbius', NULL, NULL),
    (p_profile_id, 'film', 'pas_aime', 'Cats (2019)', NULL, NULL),
    (p_profile_id, 'film', 'a_voir', 'The Killer', NULL, NULL),
    (p_profile_id, 'film', 'a_voir', 'Past Lives', NULL, NULL),

    -- Séries
    (p_profile_id, 'serie', 'aime', 'The Leftovers', NULL, NULL),
    (p_profile_id, 'serie', 'aime', 'Chernobyl', NULL, NULL),
    (p_profile_id, 'serie', 'aime', 'Arcane', NULL, NULL),
    (p_profile_id, 'serie', 'pas_aime', 'Emily in Paris', NULL, NULL),
    (p_profile_id, 'serie', 'pas_aime', 'The Idol', NULL, NULL),
    (p_profile_id, 'serie', 'a_voir', 'Severance', NULL, NULL),
    (p_profile_id, 'serie', 'a_voir', 'Shōgun', NULL, NULL),

    -- Jeux vidéo
    (p_profile_id, 'jeu', 'aime', 'The Last of Us Part I', 'PS5', NULL),
    (p_profile_id, 'jeu', 'aime', 'Uncharted 4: A Thief''s End', 'PS5', NULL),
    (p_profile_id, 'jeu', 'aime', 'Ori and the Will of the Wisps', 'PC', NULL),
    (p_profile_id, 'jeu', 'pas_aime', 'Assassin''s Creed Mirage', 'PC', NULL),
    (p_profile_id, 'jeu', 'pas_aime', 'The Elder Scrolls V: Skyrim', 'PC', NULL),
    (p_profile_id, 'jeu', 'a_voir', 'A Plague Tale: Requiem', 'PC', NULL),
    (p_profile_id, 'jeu', 'a_voir', 'Alan Wake 2', 'PS5', NULL),

    -- Livres
    (p_profile_id, 'livre', 'aime', 'Hyperion - Dan Simmons', NULL, NULL),
    (p_profile_id, 'livre', 'aime', 'Le Problème à trois corps - Liu Cixin', NULL, NULL),
    (p_profile_id, 'livre', 'aime', 'L''Anomalie - Hervé Le Tellier', NULL, NULL),
    (p_profile_id, 'livre', 'pas_aime', 'After - Anna Todd', NULL, NULL),
    (p_profile_id, 'livre', 'pas_aime', 'Twilight - Stephenie Meyer', NULL, NULL),
    (p_profile_id, 'livre', 'a_voir', 'Les Furtifs - Alain Damasio', NULL, NULL),
    (p_profile_id, 'livre', 'a_voir', 'Le Maître du Haut Château - Philip K. Dick', NULL, NULL),

    -- Musiques
    (p_profile_id, 'musique', 'aime', 'Civilisation - Orelsan', NULL, NULL),
    (p_profile_id, 'musique', 'aime', 'Feu - Nekfeu', NULL, NULL),
    (p_profile_id, 'musique', 'aime', 'Multitude - Stromae', NULL, NULL),
    (p_profile_id, 'musique', 'pas_aime', 'Baby Shark - Pinkfong', NULL, NULL),
    (p_profile_id, 'musique', 'pas_aime', 'Harlem Shake - Baauer', NULL, NULL),
    (p_profile_id, 'musique', 'a_voir', 'Mauvais Ordre - Lomepal', NULL, NULL),
    (p_profile_id, 'musique', 'a_voir', 'Géopoétique - MC Solaar', NULL, NULL);
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.seed_anonymous_profile(uuid, boolean) TO anon, authenticated;
