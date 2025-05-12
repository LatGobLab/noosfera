import {
    useInfiniteQuery,
    type InfiniteData,
    type QueryFunctionContext,
    type GetNextPageParamFunction,
  } from '@tanstack/react-query';
  import supabaseClient from '@/src/lib/supabase'; 
  import { fetchPaginatedTopLevelComments } from '@/src/services/commentService';
  import type { Comment, PaginatedCommentsResponse } from '@/src/types/comments'; 
  
  const DEFAULT_COMMENTS_PAGE_SIZE_FOR_HOOK = 20;
  
  // Define el tipo para QueryKey para mayor claridad si es complejo
  type CommentsQueryKey = readonly ['comments', number | string, 'infinite', number];
  
  export const useInfiniteComments = (
    reportId: number | string, 
    pageSize: number = DEFAULT_COMMENTS_PAGE_SIZE_FOR_HOOK
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
  
      // Opciones adicionales (opcionales)
      // enabled: !!reportId,
      // staleTime: 1000 * 60 * 5, // 5 minutos
    });
  };
  
  // Ejemplo de cómo usarías el hook en tu componente de React Native (con tipos):
  /*
  import React from 'react';
  import { View, Text, FlatList, Button, ActivityIndicator } from 'react-native';
  import { useInfiniteComments } from './src/hooks/useInfiniteComments'; // Ajusta la ruta
  import type { Comment as CommentType } from './src/types/database.types'; // Ajusta la ruta
  
  interface CommentsScreenProps {
    reportId: number | string;
  }
  
  const CommentsScreen: React.FC<CommentsScreenProps> = ({ reportId }) => {
    const {
      data,
      fetchNextPage,
      hasNextPage,
      isLoading,
      isFetchingNextPage,
      error,
    } = useInfiniteComments(reportId);
  
    if (isLoading && !data?.pages.length) {
      return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
    }
  
    if (error) {
      return <Text>Error al cargar comentarios: {error.message}</Text>;
    }
  
    // `data.pages` es un array de `PaginatedCommentsResponse`.
    // Aplanamos para obtener una lista única de comentarios.
    const comments: CommentType[] = data?.pages.flatMap(page => page.comments) || [];
  
    const loadMoreComments = () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };
  
    const renderComment = ({ item }: { item: CommentType }) => (
      <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
        <Text style={{ fontWeight: 'bold' }}>
          {item.profiles?.username || 'Usuario Anónimo'}
        </Text>
        <Text>{item.contenido}</Text>
        <Text style={{ fontSize: 12, color: 'gray' }}>
          Likes: {item.likes_count} - Creado: {new Date(item.fecha_creacion).toLocaleDateString()}
        </Text>
      </View>
    );
  
    return (
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id_comentario.toString()}
        onEndReached={loadMoreComments}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
        }
        ListEmptyComponent={!isLoading ? <Text>No hay comentarios aún.</Text> : null}
      />
    );
  };
  
  export default CommentsScreen;
  */