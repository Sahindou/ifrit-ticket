export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TicketStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  due_date: string;
  type_id: string | null;
  created_at: string;
}

export interface TicketCreateOrUpdate {
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  due_date: string;
  type_id: string | null;
}
