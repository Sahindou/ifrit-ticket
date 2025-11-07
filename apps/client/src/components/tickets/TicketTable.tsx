import type { Ticket } from '@/types/ticket';
import type { TypeTicket } from '@/types/';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TypeBadge, PriorityBadge, StatusBadge } from './TicketBadges';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

interface TicketTableProps {
  tickets: Ticket[];
  typeTickets?: TypeTicket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string) => void;
  onSort: (field: keyof Ticket) => void;
}

export const TicketTable = ({ tickets, typeTickets, onEdit, onDelete, onStatusChange, onSort }: TicketTableProps) => {
  const isOverdue = (ticket: Ticket) => {
    const dueDate = new Date(ticket.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && ticket.status !== 'done';
  };

  const getTypeName = (typeId: string | null) => {
    if (!typeId || !typeTickets) return undefined;
    return typeTickets.find(t => t.id === typeId)?.name;
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => onSort('title')} className="h-8 px-2">
                Title <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => onSort('priority')} className="h-8 px-2">
                Priority <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => onSort('due_date')} className="h-8 px-2">
                Due Date <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No tickets found
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow 
                key={ticket.id}
                className={isOverdue(ticket) ? 'bg-destructive/10 border-l-4 border-l-destructive' : ''}
              >
                <TableCell className="font-medium">
                  {ticket.title}
                  {isOverdue(ticket) && (
                    <span className="ml-2 text-xs text-destructive font-semibold">OVERDUE</span>
                  )}
                </TableCell>
                <TableCell>
                  <TypeBadge typeId={ticket.type_id} typeName={getTypeName(ticket.type_id)} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge 
                    status={ticket.status} 
                    onClick={() => onStatusChange(ticket.id)}
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(ticket.due_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(ticket)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(ticket.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
