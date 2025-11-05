export type TicketType = 'bug' | 'feature' | 'update' | 'hotfix';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'todo' | 'in_progress' | 'done';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  due_date: string;
  created_at: string;
}
