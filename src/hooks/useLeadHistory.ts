import { useQuery } from '@tanstack/react-query';
import { getLeadHistory } from '@/api/history';

export function useLeadHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: getLeadHistory,
    staleTime: 30_000,
  });
}
