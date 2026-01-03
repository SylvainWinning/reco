import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useProfile } from '@/lib/profile-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Film, Clapperboard, Gamepad2, BookOpen, Music, X, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { preferences, updatePreferences, isLoading } = useProfile();
  const [general, setGeneral] = useState(preferences.general);
  const [directors, setDirectors] = useState<string[]>(preferences.directors);
  const [actors, setActors] = useState<string[]>(preferences.actors);
  const [musicGenres, setMusicGenres] = useState<string[]>(preferences.music_genres);
  const [gamePrefs, setGamePrefs] = useState(preferences.game_preferences);
  const [bookPrefs, setBookPrefs] = useState(preferences.book_preferences);

  const [newDirector, setNewDirector] = useState('');
  const [newActor, setNewActor] = useState('');
  const [newGenre, setNewGenre] = useState('');

  const handleSave = async () => {
    await updatePreferences({
      general,
      directors,
      actors,
      music_genres: musicGenres,
      game_preferences: gamePrefs,
      book_preferences: bookPrefs,
    });
    toast.success('Profil sauvegardé !');
  };

  const addToList = (list: string[], setList: (v: string[]) => void, value: string, setValue: (v: string) => void) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()]);
      setValue('');
    }
  };

  const removeFromList = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.filter(item => item !== value));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">
              <span className="gold-text">Mon profil</span>
            </h1>
            <p className="text-muted-foreground">
              Définissez vos préférences pour de meilleures recommandations
            </p>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>

        {/* General preferences */}
        <Card className="vault-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Préférences générales
            </CardTitle>
            <CardDescription>
              Décrivez vos goûts généraux en quelques phrases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={general}
              onChange={(e) => setGeneral(e.target.value)}
              placeholder="Ex: J'aime les œuvres avec des intrigues complexes, des retournements de situation, et des personnages nuancés. Je préfère les ambiances sombres et les thèmes matures."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Directors */}
        <Card className="vault-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-primary" />
              Réalisateurs aimés
            </CardTitle>
            <CardDescription>
              Films & Séries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newDirector}
                onChange={(e) => setNewDirector(e.target.value)}
                placeholder="Ajouter un réalisateur"
                onKeyDown={(e) => e.key === 'Enter' && addToList(directors, setDirectors, newDirector, setNewDirector)}
              />
              <Button variant="outline" onClick={() => addToList(directors, setDirectors, newDirector, setNewDirector)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {directors.map((director) => (
                <Badge key={director} variant="secondary" className="gap-1">
                  {director}
                  <button onClick={() => removeFromList(directors, setDirectors, director)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {directors.length === 0 && (
                <span className="text-sm text-muted-foreground">Aucun réalisateur ajouté</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actors */}
        <Card className="vault-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="w-5 h-5 text-primary" />
              Acteurs aimés
            </CardTitle>
            <CardDescription>
              Films & Séries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newActor}
                onChange={(e) => setNewActor(e.target.value)}
                placeholder="Ajouter un acteur/actrice"
                onKeyDown={(e) => e.key === 'Enter' && addToList(actors, setActors, newActor, setNewActor)}
              />
              <Button variant="outline" onClick={() => addToList(actors, setActors, newActor, setNewActor)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {actors.map((actor) => (
                <Badge key={actor} variant="secondary" className="gap-1">
                  {actor}
                  <button onClick={() => removeFromList(actors, setActors, actor)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {actors.length === 0 && (
                <span className="text-sm text-muted-foreground">Aucun acteur ajouté</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Music genres */}
        <Card className="vault-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5 text-primary" />
              Genres musicaux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                placeholder="Ex: Rap FR, Jazz, Rock progressif..."
                onKeyDown={(e) => e.key === 'Enter' && addToList(musicGenres, setMusicGenres, newGenre, setNewGenre)}
              />
              <Button variant="outline" onClick={() => addToList(musicGenres, setMusicGenres, newGenre, setNewGenre)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {musicGenres.map((genre) => (
                <Badge key={genre} variant="secondary" className="gap-1">
                  {genre}
                  <button onClick={() => removeFromList(musicGenres, setMusicGenres, genre)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {musicGenres.length === 0 && (
                <span className="text-sm text-muted-foreground">Aucun genre ajouté</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game preferences */}
        <Card className="vault-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-primary" />
              Préférences jeux vidéo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={gamePrefs}
              onChange={(e) => setGamePrefs(e.target.value)}
              placeholder="Ex: Je préfère les jeux narratifs immersifs avec des choix moraux. J'aime les RPG et les jeux d'action-aventure. Pas fan des jeux très difficiles type souls-like."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Book preferences */}
        <Card className="vault-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Préférences littéraires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={bookPrefs}
              onChange={(e) => setBookPrefs(e.target.value)}
              placeholder="Ex: J'aime la science-fiction, le thriller psychologique et les romans historiques. Je préfère les livres de moins de 500 pages."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder les modifications
          </Button>
        </div>
      </div>
    </Layout>
  );
}
