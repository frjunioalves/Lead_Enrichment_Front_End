import { useQuery } from '@tanstack/react-query';
import { getLeadHistory } from '@/api/history';

// staleTime de 30s evita refetches desnecessários durante navegação entre Sidebar e HistoryPage
export function useLeadHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: getLeadHistory,
    staleTime: 30_000,
  });
}
