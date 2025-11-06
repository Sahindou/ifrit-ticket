import { useState, useMemo } from 'react';
import type { Ticket, TicketType, TicketStatus } from '@/types/ticket';
import { mockTickets } from '@/data/mockTickets';
import { TicketStats } from '@/components/tickets/TicketStats';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import { TicketTable } from '@/components/tickets/TicketTable';
import { TicketForm } from '@/components/tickets/TicketForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, NavBar } from '@/components/ui/';
import { toast } from 'sonner';


const Dashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TicketType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Ticket>('due_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || ticket.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
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

  const handleCreateOrUpdate = (ticketData: Omit<Ticket, 'id' | 'created_at'>) => {
    if (editingTicket) {
      setTickets(tickets.map(t => 
        t.id === editingTicket.id 
          ? { ...ticketData, id: editingTicket.id, created_at: editingTicket.created_at }
          : t
      ));
      toast.success('Ticket updated successfully');
      setEditingTicket(undefined);
    } else {
      const newTicket: Ticket = {
        ...ticketData,
        id: Date.now().toString(),
        created_at: new Date().toISOString().split('T')[0],
      };
      setTickets([newTicket, ...tickets]);
      toast.success('Ticket created successfully');
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
    toast.success('Ticket deleted successfully');
    setDeleteId(null);
  };

  const handleStatusChange = (id: string) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === id) {
        const statusCycle: TicketStatus[] = ['todo', 'in_progress', 'done'];
        const currentIndex = statusCycle.indexOf(ticket.status);
        const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
        return { ...ticket, status: nextStatus };
      }
      return ticket;
    }));
    toast.success('Status updated');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <NavBar
          setEditingTicket={setEditingTicket}
          setIsFormOpen={setIsFormOpen}
        />

        <TicketStats tickets={tickets} />

        <TicketFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <TicketTable
          tickets={filteredAndSortedTickets}
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
