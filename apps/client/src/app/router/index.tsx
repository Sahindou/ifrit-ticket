import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/components/errors/NotFound";
import PublicTicket from "@/pages/PublicTicket";
import Kanban from "@/pages/Kanban";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ticket" element={<PublicTicket />} />
        <Route path="/kanban" element={<Kanban />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
