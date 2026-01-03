import { cn } from '@/lib/utils';
import { Rating } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

interface ScoreDisplayProps {
  rating: Rating;
  source: 'metacritic' | 'senscritique';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ScoreDisplay({ rating, source, size = 'md', className }: ScoreDisplayProps) {
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-amber-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const sourceLogo = source === 'metacritic' ? 'MC' : 'SC';
  const sourceName = source === 'metacritic' ? 'Metacritic' : 'SensCritique';

  return (
    <div className={cn('flex items-center gap-2', sizeStyles[size], className)}>
      <span className="text-muted-foreground font-medium">{sourceLogo}</span>
      {rating.status === 'found' && rating.score !== null ? (
        <>
          <span className={cn('font-bold', getScoreColor(rating.score))}>
            {rating.score.toFixed(1)}
          </span>
          {rating.url && (
            <a
              href={rating.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              title={`Voir sur ${sourceName}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </>
      ) : (
        <span className="text-muted-foreground italic text-sm">
          {rating.status === 'error' ? 'Erreur' : 'Non trouvé'}
        </span>
      )}
    </div>
  );
}

interface ScoreRowProps {
  metacritic: Rating;
  senscritique: Rating;
  className?: string;
}

export function ScoreRow({ metacritic, senscritique, className }: ScoreRowProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <ScoreDisplay rating={metacritic} source="metacritic" />
      <div className="w-px h-4 bg-border" />
      <ScoreDisplay rating={senscritique} source="senscritique" />
    </div>
  );
}
