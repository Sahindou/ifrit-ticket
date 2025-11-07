import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketCreateOrUpdate,
} from "@/types/ticket";
import type { TypeTicket } from "@/types/";

interface TicketFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (ticket: TicketCreateOrUpdate) => void;
  ticket?: Ticket;
  typeTickets?: TypeTicket[];
}

export const TicketForm = ({
  open,
  onOpenChange,
  onSubmit,
  ticket,
  typeTickets,
}: TicketFormProps) => {
  const formatDateToYYYYMMDD = (dateString: string): string => {
    // Convertit DD-MM-YYYY vers YYYY-MM-DD pour l'input date
    if (!dateString || !dateString.includes("-")) return dateString;
    const parts = dateString.split("-");
    if (parts.length === 3 && parts[0].length === 2) {
      // Format DD-MM-YYYY
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString; // Déjà au bon format
  };

  const [formData, setFormData] = useState<TicketCreateOrUpdate>({
    title: ticket?.title || "",
    description: ticket?.description || "",
    priority: ticket?.priority || "MEDIUM",
    status: ticket?.status || "TO_DO",
    due_date: ticket?.due_date ? formatDateToYYYYMMDD(ticket.due_date) : "",
    type_id: ticket?.type_id || typeTickets?.[0]?.id || null,
  });

  const formatDateToDDMMYYYY = (dateString: string): string => {
    // Convertit YYYY-MM-DD vers DD-MM-YYYY
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Formater les données pour correspondre au schéma serveur
    const submitData: TicketCreateOrUpdate = {
      ...formData,
      due_date: formatDateToDDMMYYYY(formData.due_date),
    };

    onSubmit(submitData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {ticket ? "Edit Ticket" : "Create New Ticket"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter ticket title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter ticket description"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type_id">Type</Label>
              <Select
                value={formData.type_id || undefined}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, type_id: value })
                }
              >
                <SelectTrigger id="type_id">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {typeTickets &&
                    typeTickets.map((typeTicket) => (
                      <SelectItem key={typeTicket.id} value={typeTicket.id}>
                        {typeTicket.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TicketPriority) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TicketStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TO_DO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{ticket ? "Update" : "Create"} Ticket</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
