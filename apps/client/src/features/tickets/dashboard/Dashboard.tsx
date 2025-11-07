import { useState, useMemo } from 'react';
import type { Ticket, TicketStatus, TicketCreateOrUpdate } from '@/types/ticket';
import { TicketStats } from '@/components/tickets/TicketStats';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import { TicketTable } from '@/components/tickets/TicketTable';
import { TicketForm } from '@/components/tickets/TicketForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, NavBar } from '@/components/ui/';
import { toast } from 'sonner';
import { useTickets, useCreateTicket, useUpdateTicket, useDeleteTicket } from '../hooks/useTicket';
import { useTypeTickets } from '@/features/type-tickets/hooks/useTypeTicket';
import { ensureDDMMYYYY } from '@/utils/dateFormatter';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Ticket>('due_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: tickets, isLoading } = useTickets();
  const { data: typeTickets } = useTypeTickets();
  const createTicketMutation = useCreateTicket();
  const updateTicketMutation = useUpdateTicket();
  const deleteTicketMutation = useDeleteTicket();


  
  const filteredAndSortedTickets = useMemo(() => {
   if (!tickets) return [];

    let filtered = tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || ticket.type_id === typeFilter;
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1 * direction;
      if (bValue == null) return -1 * direction;
      
      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });

    return filtered;
  }, [tickets, searchQuery, typeFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: keyof Ticket) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCreateOrUpdate = (ticketData: TicketCreateOrUpdate) => {
    if (editingTicket) {
      updateTicketMutation.mutate(
        { id: editingTicket.id, data: ticketData },
        {
          onSuccess: () => {
            toast.success('Ticket updated successfully');
            setEditingTicket(undefined);
            setIsFormOpen(false);
          },
          onError: (error) => {
            toast.error('Failed to update ticket');
            console.error(error);
          }
        }
      );
    } else {
      createTicketMutation.mutate(ticketData, {
        onSuccess: () => {
          toast.success('Ticket created successfully');
          setIsFormOpen(false);
        },
        onError: (error) => {
          toast.error('Failed to create ticket');
          console.error(error);
        }
      });
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTicketMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Ticket deleted successfully');
        setDeleteId(null);
      },
      onError: (error) => {
        toast.error('Failed to delete ticket');
        console.error(error);
      }
    });
  };

  const handleStatusChange = (id: string) => {
    if (!tickets) return;
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;

    const statusCycle: TicketStatus[] = ['TO_DO', 'IN_PROGRESS', 'DONE'];
    const currentIndex = statusCycle.indexOf(ticket.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    const updatedData: TicketCreateOrUpdate = {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: nextStatus,
      due_date: ensureDDMMYYYY(ticket.due_date),
      type_id: ticket.type_id,
    };

    updateTicketMutation.mutate(
      { id, data: updatedData },
      {
        onSuccess: () => {
          toast.success('Status updated');
        },
        onError: (error) => {
          toast.error('Failed to update status');
          console.error(error);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <NavBar
          setEditingTicket={setEditingTicket}
          setIsFormOpen={setIsFormOpen}
        />

        <TicketStats tickets={tickets || []} />

        <TicketFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          typeTickets={typeTickets}
        />

        <TicketTable
          tickets={filteredAndSortedTickets}
          typeTickets={typeTickets}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
          onStatusChange={handleStatusChange}
          onSort={handleSort}
        />

        <TicketForm
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingTicket(undefined);
          }}
          onSubmit={handleCreateOrUpdate}
          ticket={editingTicket}
          typeTickets={typeTickets}
        />

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this ticket? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Dashboard;
