-- Create enum for media types
CREATE TYPE media_type AS ENUM ('film', 'serie', 'jeu', 'livre', 'musique');

-- Create enum for list status
CREATE TYPE list_status AS ENUM ('aime', 'moyen', 'pas_aime', 'a_voir');

-- Create enum for gaming platforms
CREATE TYPE gaming_platform AS ENUM ('PS5', 'PS4', 'PC', 'Xbox', 'Switch');

-- Profiles table for user preferences
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  preferences JSONB DEFAULT '{
    "general": "",
    "directors": [],
    "actors": [],
    "music_genres": [],
    "game_preferences": "",
    "book_preferences": ""
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Media lists table
CREATE TABLE public.media_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  media_type media_type NOT NULL,
  status list_status NOT NULL,
  title TEXT NOT NULL,
  platform gaming_platform,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cache for ratings
CREATE TABLE public.cache_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  search_key TEXT NOT NULL,
  score DECIMAL(3,1),
  url TEXT,
  status TEXT NOT NULL DEFAULT 'found',
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(source, search_key)
);

-- Recommendation history
CREATE TABLE public.recommendation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  query_title TEXT NOT NULL,
  media_type media_type NOT NULL,
  platform gaming_platform,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cache_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Allow anonymous profiles (for local mode)
CREATE POLICY "Anyone can create anonymous profile"
ON public.profiles FOR INSERT
WITH CHECK (user_id IS NULL);

CREATE POLICY "Anyone can view anonymous profiles"
ON public.profiles FOR SELECT
USING (user_id IS NULL);

CREATE POLICY "Anyone can update anonymous profiles"
ON public.profiles FOR UPDATE
USING (user_id IS NULL);

-- Media lists policies
CREATE POLICY "Users can view their own lists"
ON public.media_lists FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = media_lists.profile_id 
  AND (profiles.user_id = auth.uid() OR profiles.user_id IS NULL)
));

CREATE POLICY "Users can insert into their own lists"
ON public.media_lists FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = media_lists.profile_id 
  AND (profiles.user_id = auth.uid() OR profiles.user_id IS NULL)
));

CREATE POLICY "Users can update their own lists"
ON public.media_lists FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = media_lists.profile_id 
  AND (profiles.user_id = auth.uid() OR profiles.user_id IS NULL)
));

CREATE POLICY "Users can delete from their own lists"
ON public.media_lists FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = media_lists.profile_id 
  AND (profiles.user_id = auth.uid() OR profiles.user_id IS NULL)
));

-- Cache ratings - public read/write for caching
CREATE POLICY "Anyone can read cache"
ON public.cache_ratings FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert cache"
ON public.cache_ratings FOR INSERT
WITH CHECK (true);

-- Recommendation history policies
CREATE POLICY "Users can view their own history"
ON public.recommendation_history FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = recommendation_history.profile_id 
  AND (profiles.user_id = auth.uid() OR profiles.user_id IS NULL)
));

CREATE POLICY "Users can insert into their own history"
ON public.recommendation_history FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = recommendation_history.profile_id 
  AND (profiles.user_id = auth.uid() OR profiles.user_id IS NULL)
));

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();