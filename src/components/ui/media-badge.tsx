import { cn } from '@/lib/utils';
import { MediaType, ListStatus, MEDIA_TYPE_ICONS, MEDIA_TYPE_LABELS, LIST_STATUS_LABELS } from '@/lib/types';

interface MediaBadgeProps {
  mediaType: MediaType;
  className?: string;
}

export function MediaBadge({ mediaType, className }: MediaBadgeProps) {
  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        'bg-secondary text-secondary-foreground border border-border',
        className
      )}
    >
      <span>{MEDIA_TYPE_ICONS[mediaType]}</span>
      <span>{MEDIA_TYPE_LABELS[mediaType]}</span>
    </span>
  );
}

interface StatusBadgeProps {
  status: ListStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusStyles: Record<ListStatus, string> = {
    aime: 'status-loved',
    moyen: 'status-medium',
    pas_aime: 'status-disliked',
    a_voir: 'status-watchlist',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
        statusStyles[status],
        className
      )}
    >
      {LIST_STATUS_LABELS[status]}
    </span>
  );
}
