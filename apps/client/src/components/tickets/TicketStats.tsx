import type { Ticket } from "@/types/ticket";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface TicketStatsProps {
  tickets: Ticket[];
}

export const TicketStats = ({ tickets }: TicketStatsProps) => {
  const total = tickets.length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const overdue = tickets.filter((t) => {
    const dueDate = new Date(t.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && t.status !== "done";
  }).length;

  const stats = [
    {
      label: "Total Tickets",
      value: total,
      icon: CheckCircle2,
      color: "text-primary",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "text-warning",
    },
    {
      label: "Overdue",
      value: overdue,
      icon: AlertCircle,
      color: "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};
