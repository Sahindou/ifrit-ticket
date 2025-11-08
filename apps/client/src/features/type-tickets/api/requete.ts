import axios from 'axios';
import type { TypeTicket, TypeTicketCreateOrUpdate } from '@/types/';
const api_url = import.meta.env.VITE_API_URL;

// TODO: remplancer le type any plutart par le type approprié
export const requeteTypeTicketApi = {
    createTicket: (data: TypeTicketCreateOrUpdate) => {
        return axios.post(`${api_url}/type-tickets`, data);
    },
    getTypeTickets: (): Promise<TypeTicket[]> => {
        return axios.get(`${api_url}/type-tickets`).then(response => response.data.data);
    }
};