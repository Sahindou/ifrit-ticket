import { Badge } from '@/components/ui/badge';
import type {  TicketPriority, TicketStatus } from '@/types/ticket';

const typeConfig: Record<string, { icon: string; label: string; variant: string }> = {
  bug: { icon: '🐛', label: 'Bug', variant: 'destructive' },
  feature: { icon: '📈', label: 'Feature', variant: 'default' },
  update: { icon: '🔄', label: 'Update', variant: 'secondary' },
  hotfix: { icon: '🔥', label: 'Hotfix', variant: 'destructive' },
};

const priorityConfig: Record<TicketPriority, { variant: string; className: string }> = {
  LOW: { variant: 'outline', className: 'border-success text-success' },
  MEDIUM: { variant: 'outline', className: 'border-warning text-warning' },
  HIGH: { variant: 'outline', className: 'border-destructive text-destructive' },
};

const statusConfig: Record<TicketStatus, { label: string; variant: string }> = {
  TO_DO: { label: 'To Do', variant: 'outline' },
  IN_PROGRESS: { label: 'In Progress', variant: 'default' },
  DONE: { label: 'Done', variant: 'secondary' },
};

export const TypeBadge = ({ typeId, typeName }: { typeId: string | null; typeName?: string }) => {
  // Si pas de typeId ou typeName, afficher un badge par défaut
  if (!typeId || !typeName) {
    return (
      <Badge variant="outline">
        {typeName || 'N/A'}
      </Badge>
    );
  }

  // Essayer de trouver une config par défaut basée sur le nom (optionnel)
  const lowerName = typeName.toLowerCase();
  let config = typeConfig[lowerName];

  // Si pas de config trouvée, utiliser une config par défaut
  if (!config) {
    config = { icon: '📋', label: typeName, variant: 'default' };
  }

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
