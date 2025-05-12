import {
    useInfiniteQuery,
    type InfiniteData,
    type QueryFunctionContext,
    type UseInfiniteQueryOptions,
  } from '@tanstack/react-query';
  import supabaseClient from '@/src/lib/supabase'; 
  import { fetchPaginatedTopLevelComments } from '@/src/services/commentService';
  import type { Comment, PaginatedCommentsResponse } from '@/src/types/comments'; 
  
  const DEFAULT_COMMENTS_PAGE_SIZE_FOR_HOOK = 20;
  
  // Define el tipo para QueryKey para mayor claridad si es complejo
  type CommentsQueryKey = readonly ['comments', number | string, 'infinite', number];
  
  export const useInfiniteComments = (
    reportId: number | string, 
    pageSize: number = DEFAULT_COMMENTS_PAGE_SIZE_FOR_HOOK,
    options?: Omit<UseInfiniteQueryOptions<
      PaginatedCommentsResponse,
      Error,
      InfiniteData<PaginatedCommentsResponse>,
      PaginatedCommentsResponse,
      CommentsQueryKey,
      number
    >, 'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'>
  ) => {
    return useInfiniteQuery<
      PaginatedCommentsResponse,
      Error,                     
      InfiniteData<PaginatedCommentsResponse>, 
      CommentsQueryKey,         
      number                     // TPageParam: Tipo del pageParam (número de página)
    >({
      queryKey: ['comments', reportId, 'infinite', pageSize] as const, 
  
      queryFn: async ({ pageParam = 1 }: QueryFunctionContext<CommentsQueryKey, number | undefined>) => {
        // pageParam es 1 para la primera llamada debido a initialPageParam
        // y luego el número devuelto por getNextPageParam.
        // Si initialPageParam no se usa, puede ser undefined en la primera llamada.
        // fetchPaginatedTopLevelComments ya maneja pageParam como 1 por defecto si es undefined.
        return fetchPaginatedTopLevelComments({
          supabase: supabaseClient,
          reportId,
          pageParam: pageParam, // Aquí pageParam es `number` porque initialPageParam es 1
          pageSize,
        });
      },
  
      initialPageParam: 1, // La primera página a cargar
  
      getNextPageParam: (lastPage: PaginatedCommentsResponse): number | undefined => {
        const { totalCount, currentPage, pageSize: actualPageSize } = lastPage;
        const loadedItemsCount = currentPage * actualPageSize;
  
        if (loadedItemsCount < totalCount) {
          return currentPage + 1; // Devuelve el número de la siguiente página
        }
        return undefined; // No hay más páginas
      },
  
      // Spread de opciones adicionales si existen
      ...options,
    });
  };
  