import axios from 'axios';
import type { Ticket, TicketCreateOrUpdate } from '@/types/ticket';

const api_url = import.meta.env.VITE_API_URL;

export const requeteTicketApi = {
    getTickets: () => {
        return axios.get<{ data: Ticket[] }>(`${api_url}tickets`);
    },
    createTicket: (data: TicketCreateOrUpdate) => {
        return axios.post<Ticket>(`${api_url}tickets`, data);
    },
    updateTicket: (id: string, data: TicketCreateOrUpdate) => {
        return axios.put<Ticket>(`${api_url}tickets/${id}`, data);
    },
    deleteTicket: (id: string) => {
        return axios.delete(`${api_url}tickets/${id}`);
    }
}