import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, LayoutGrid, Home } from "lucide-react";
import { Link } from "react-router-dom";
import type { Ticket } from "@/types/ticket";

interface NavBarProps {
  setEditingTicket: (ticket: Ticket | undefined) => void;
  setIsFormOpen: (isOpen: boolean) => void;
}

const NavBar = ({ setEditingTicket, setIsFormOpen }: NavBarProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold">Ticket Management</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage your project tickets
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/ticket">
            <ExternalLink className="mr-2 h-4 w-4" />
            Page Client
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/kanban">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Vue Kanban
          </Link>
        </Button>
        <Button
          onClick={() => {
            setEditingTicket(undefined);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
