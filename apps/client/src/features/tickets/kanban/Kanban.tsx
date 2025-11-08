import { useState } from "react";
import type { Ticket, TicketStatus, TicketCreateOrUpdate } from "@/types/ticket";
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
  NavBar,
} from "@/components/ui/";
import { Pencil, Trash2 } from "lucide-react";
import { TicketForm } from "@/components/tickets/TicketForm";
import { toast } from "sonner";
import { useTickets, useUpdateTicket, useDeleteTicket } from "../hooks/useTicket";
import { useTypeTickets } from "@/features/type-tickets/hooks/useTypeTicket";
import { ensureDDMMYYYY } from "@/utils/dateFormatter";

const statusLabels: Record<TicketStatus, string> = {
  TO_DO: "À faire",
  IN_PROGRESS: "En cours",
  DONE: "Terminé",
};

const Kanban = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: tickets, isLoading } = useTickets();
  const { data: typeTickets } = useTypeTickets();
  const updateTicketMutation = useUpdateTicket();
  const deleteTicketMutation = useDeleteTicket();

  const getTicketsByStatus = (status: TicketStatus) => {
    if (!tickets) return [];
    return tickets.filter((ticket) => ticket.status === status);
  };

  const getTypeName = (typeId: string | null) => {
    if (!typeId || !typeTickets) return undefined;
    return typeTickets.find(t => t.id === typeId)?.name;
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTicketMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Ticket supprimé avec succès");
        setDeleteId(null);
      },
      onError: (error) => {
        toast.error("Échec de la suppression du ticket");
        console.error(error);
      }
    });
  };

  const handleCreateOrUpdate = (ticketData: TicketCreateOrUpdate) => {
    if (editingTicket) {
      updateTicketMutation.mutate(
        { id: editingTicket.id, data: ticketData },
        {
          onSuccess: () => {
            toast.success("Ticket mis à jour avec succès");
            setEditingTicket(undefined);
            setIsFormOpen(false);
          },
          onError: (error) => {
            toast.error("Échec de la mise à jour du ticket");
            console.error(error);
          }
        }
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, ticket: Ticket) => {
    e.dataTransfer.setData("ticketId", ticket.id);
  };

  const handleDrop = (e: React.DragEvent, newStatus: TicketStatus) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData("ticketId");

    if (!tickets) return;
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const updatedData: TicketCreateOrUpdate = {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: newStatus,
      due_date: ensureDDMMYYYY(ticket.due_date),
      type_id: ticket.type_id,
    };

    updateTicketMutation.mutate(
      { id: ticketId, data: updatedData },
      {
        onSuccess: () => {
          toast.success("Statut mis à jour");
        },
        onError: (error) => {
          toast.error("Échec de la mise à jour du statut");
          console.error(error);
        }
      }
    );
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

  const columns: TicketStatus[] = ["TO_DO", "IN_PROGRESS", "DONE"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement des tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <NavBar
          setEditingTicket={setEditingTicket}
          setIsFormOpen={setIsFormOpen}
        />
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
                      isOverdue(ticket.due_date) && ticket.status !== "DONE"
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
                        <TypeBadge typeId={ticket.type_id} typeName={getTypeName(ticket.type_id)} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <span
                          className={
                            isOverdue(ticket.due_date) &&
                            ticket.status !== "DONE"
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
          typeTickets={typeTickets}
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
