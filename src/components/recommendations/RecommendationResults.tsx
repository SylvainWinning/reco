import { AnalysisResult, ListStatus } from '@/lib/types';
import { useProfile } from '@/lib/profile-context';
import { Button } from '@/components/ui/button';
import { MediaBadge } from '@/components/ui/media-badge';
import { ScoreRow } from '@/components/ui/score-display';
import { Plus, Check, ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

interface RecommendationResultsProps {
  results: AnalysisResult;
}

export function RecommendationResults({ results }: RecommendationResultsProps) {
  const { addMediaItem, isInAnyList } = useProfile();
  const [addingId, setAddingId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<number, ListStatus>>({});

  const handleAddToList = async (index: number) => {
    const rec = results.recommendations[index];
    const status = selectedStatus[index] || 'a_voir';
    
    if (isInAnyList(rec.title, rec.media_type)) {
      toast.info('Cette œuvre est déjà dans vos listes');
      return;
    }

    setAddingId(index);
    
    await addMediaItem({
      title: rec.title,
      media_type: rec.media_type,
      status,
      platform: rec.platform,
    });

    toast.success(`"${rec.title}" ajouté à vos listes`);
    setAddingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Query result card */}
      <div className="vault-card-elevated p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Œuvre analysée</p>
            <h3 className="font-display text-xl font-semibold mb-2">{results.query.title}</h3>
            <div className="flex items-center gap-3">
              <MediaBadge mediaType={results.query.media_type} />
              {results.query.platform && (
                <span className="text-sm text-muted-foreground">{results.query.platform}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-2">Notes</p>
            <ScoreRow 
              metacritic={results.query.metacritic} 
              senscritique={results.query.senscritique} 
            />
          </div>
        </div>
      </div>

      {/* Recommendations table */}
      <div className="vault-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-display font-semibold">5 recommandations personnalisées</h3>
          <p className="text-sm text-muted-foreground">Triées par note Metacritic (user score)</p>
        </div>
        
        <div className="divide-y divide-border">
          {results.recommendations.map((rec, index) => {
            const alreadyInList = isInAnyList(rec.title, rec.media_type);
            
            return (
              <div 
                key={index}
                className="px-6 py-4 hover:bg-muted/30 transition-colors animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-display font-bold text-primary">{rec.rank}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">{rec.title}</h4>
                      <MediaBadge mediaType={rec.media_type} className="flex-shrink-0" />
                      {rec.platform && (
                        <span className="text-xs text-muted-foreground">{rec.platform}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{rec.reason}</p>
                    <div className="mt-2">
                      <ScoreRow metacritic={rec.metacritic} senscritique={rec.senscritique} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!alreadyInList && (
                      <Select 
                        value={selectedStatus[index] || 'a_voir'}
                        onValueChange={(v) => setSelectedStatus(prev => ({ ...prev, [index]: v as ListStatus }))}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a_voir">À voir</SelectItem>
                          <SelectItem value="aime">Aimé</SelectItem>
                          <SelectItem value="moyen">Moyen</SelectItem>
                          <SelectItem value="pas_aime">Pas aimé</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    <Button
                      size="sm"
                      variant={alreadyInList ? 'secondary' : 'default'}
                      disabled={alreadyInList || addingId === index}
                      onClick={() => handleAddToList(index)}
                    >
                      {alreadyInList ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Ajouté
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
