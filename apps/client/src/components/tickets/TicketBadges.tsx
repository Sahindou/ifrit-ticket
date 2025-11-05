import { Badge } from '@/components/ui/badge';
import type { TicketType, TicketPriority, TicketStatus } from '@/types/ticket';

const typeConfig: Record<TicketType, { icon: string; label: string; variant: string }> = {
  bug: { icon: '🐛', label: 'Bug', variant: 'destructive' },
  feature: { icon: '📈', label: 'Feature', variant: 'default' },
  update: { icon: '🔄', label: 'Update', variant: 'secondary' },
  hotfix: { icon: '🔥', label: 'Hotfix', variant: 'destructive' },
};

const priorityConfig: Record<TicketPriority, { variant: string; className: string }> = {
  low: { variant: 'outline', className: 'border-success text-success' },
  medium: { variant: 'outline', className: 'border-warning text-warning' },
  high: { variant: 'outline', className: 'border-destructive text-destructive' },
  urgent: { variant: 'destructive', className: 'animate-pulse' },
};

const statusConfig: Record<TicketStatus, { label: string; variant: string }> = {
  todo: { label: 'To Do', variant: 'outline' },
  in_progress: { label: 'In Progress', variant: 'default' },
  done: { label: 'Done', variant: 'secondary' },
};

export const TypeBadge = ({ type }: { type: TicketType }) => {
  const config = typeConfig[type];
  return (
    <Badge variant={config.variant as any}>
      {config.icon} {config.label}
    </Badge>
  );
};

export const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const config = priorityConfig[priority];
  return (
    <Badge variant={config.variant as any} className={config.className}>
      {priority.toUpperCase()}
    </Badge>
  );
};

export const StatusBadge = ({ status, onClick }: { status: TicketStatus; onClick?: () => void }) => {
  const config = statusConfig[status];
  return (
    <Badge 
      variant={config.variant as any}
      className={onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
      onClick={onClick}
    >
      {config.label}
    </Badge>
  );
};
