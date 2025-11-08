import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requeteTicketApi } from "../api/requete";
import type { TicketCreateOrUpdate } from "@/types/ticket";

export const useTickets = () => {
    return useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const response = await requeteTicketApi.getTickets();
            return response.data.data;
        },
    });
};

export const useCreateTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TicketCreateOrUpdate) => requeteTicketApi.createTicket(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
    });
};

export const useUpdateTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TicketCreateOrUpdate }) =>
            requeteTicketApi.updateTicket(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
    });
};

export const useDeleteTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => requeteTicketApi.deleteTicket(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
    });
};