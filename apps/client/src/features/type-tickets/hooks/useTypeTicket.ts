import {useQuery} from '@tanstack/react-query';
import {requeteTypeTicketApi} from '../api/requete';
import type {TypeTicket} from '@/types/';

export const useTypeTickets = () => {
  return useQuery<TypeTicket[]>({
    queryKey: ['typeTickets'],
    queryFn: requeteTypeTicketApi.getTypeTickets,
    staleTime: Infinity, // Ne devient JAMAIS obsolète
    gcTime: 1000 * 60 * 60 * 24, // Garde 24h en mémoire
  });
};
