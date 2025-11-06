import { useState } from "react";
import type { Ticket, TicketStatus } from "@/types/ticket";
import { mockTickets } from "@/data/mockTickets";
import { TypeBadge, PriorityBadge } from "@/components/tickets/TicketBadges";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { TicketForm } from "@/components/tickets/TicketForm";
import { toast } from "sonner";

const statusLabels: Record<TicketStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminé",
};

const Kanban = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getTicketsByStatus = (status: TicketStatus) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setTickets(tickets.filter((t) => t.id !== id));
    toast.success("Ticket supprimé avec succès");
    setDeleteId(null);
  };

  const handleCreateOrUpdate = (
    ticketData: Omit<Ticket, "id" | "created_at">
  ) => {
    if (editingTicket) {
      setTickets(
        tickets.map((t) =>
          t.id === editingTicket.id
            ? {
                ...ticketData,
                id: editingTicket.id,
                created_at: editingTicket.created_at,
              }
            : t
        )
      );
      toast.success("Ticket mis à jour avec succès");
      setEditingTicket(undefined);
    }
  };

  const handleDragStart = (e: React.DragEvent, ticket: Ticket) => {
    e.dataTransfer.setData("ticketId", ticket.id);
  };

  const handleDrop = (e: React.DragEvent, newStatus: TicketStatus) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData("ticketId");

    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
    toast.success("Statut mis à jour");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const isOverdue = (dueDate: string) => {
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  const columns: TicketStatus[] = ["todo", "in_progress", "done"];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold">Vue Kanban</h1>
              <p className="text-muted-foreground mt-1">
                Glissez-déposez les tickets pour changer leur statut
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((status) => (
            <div
              key={status}
              className="bg-muted/30 rounded-lg p-4"
              onDrop={(e) => handleDrop(e, status)}
              onDragOver={handleDragOver}
            >
              <div className="mb-4">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  {statusLabels[status]}
                  <span className="text-sm text-muted-foreground">
                    ({getTicketsByStatus(status).length})
                  </span>
                </h2>
              </div>

              <div className="space-y-3">
                {getTicketsByStatus(status).map((ticket) => (
                  <Card
                    key={ticket.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ticket)}
                    className={`p-4 cursor-move hover:shadow-md transition-shadow ${
                      isOverdue(ticket.due_date) && ticket.status !== "done"
                        ? "border-destructive bg-destructive/5"
                        : ""
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-sm line-clamp-2">
                          {ticket.title}
                        </h3>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEdit(ticket)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(ticket.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {ticket.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <TypeBadge type={ticket.type} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <span
                          className={
                            isOverdue(ticket.due_date) &&
                            ticket.status !== "done"
                              ? "text-destructive font-medium"
                              : ""
                          }
                        >
                          Échéance:{" "}
                          {new Date(ticket.due_date).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}

                {getTicketsByStatus(status).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Aucun ticket
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

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
              <AlertDialogTitle>Supprimer le ticket</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce ticket ? Cette action est
                irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Kanban;
