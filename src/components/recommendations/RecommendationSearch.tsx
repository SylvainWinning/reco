import { useState } from 'react';
import { MediaType, GamingPlatform, AnalysisResult, MEDIA_TYPE_LABELS, GAMING_PLATFORMS } from '@/lib/types';
import { useProfile } from '@/lib/profile-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RecommendationSearchProps {
  onResults: (results: AnalysisResult | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function RecommendationSearch({ onResults, isLoading, setIsLoading }: RecommendationSearchProps) {
  const { profileId, preferences, mediaItems } = useProfile();
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('film');
  const [platform, setPlatform] = useState<GamingPlatform>('PS5');

  const handleAnalyze = async () => {
    if (!title.trim() || !profileId) {
      toast.error('Veuillez saisir un titre');
      return;
    }

    setIsLoading(true);
    onResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('get-recommendations', {
        body: {
          title: title.trim(),
          mediaType,
          platform: mediaType === 'jeu' ? platform : undefined,
          preferences,
          existingItems: mediaItems.map(item => ({
            title: item.title,
            mediaType: item.media_type,
            status: item.status,
          })),
        },
      });

      if (error) {
        console.error('Error:', error);
        toast.error('Erreur lors de l\'analyse. Réessayez.');
        return;
      }

      if (data?.error) {
        if (data.error.includes('429') || data.error.includes('Rate limit')) {
          toast.error('Limite de requêtes atteinte. Réessayez dans quelques instants.');
        } else if (data.error.includes('402')) {
          toast.error('Crédits insuffisants. Contactez l\'administrateur.');
        } else {
          toast.error(data.error);
        }
        return;
      }

      onResults(data as AnalysisResult);
      toast.success('Analyse terminée !');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Erreur de connexion. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vault-card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">Analyseur de recommandations</h2>
          <p className="text-sm text-muted-foreground">Découvrez des œuvres similaires à vos goûts</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Label htmlFor="title">Titre de l'œuvre</Label>
          <Input
            id="title"
            placeholder="Ex: The Last of Us, Inception..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label>Type</Label>
          <Select value={mediaType} onValueChange={(v) => setMediaType(v as MediaType)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MEDIA_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {mediaType === 'jeu' && (
          <div>
            <Label>Plateforme</Label>
            <Select value={platform} onValueChange={(v) => setPlatform(v as GamingPlatform)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GAMING_PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className={mediaType !== 'jeu' ? 'lg:col-span-1' : ''}>
          <Label className="opacity-0">Action</Label>
          <Button
            onClick={handleAnalyze}
            disabled={isLoading || !title.trim()}
            className="mt-1.5 w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Analyser
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
