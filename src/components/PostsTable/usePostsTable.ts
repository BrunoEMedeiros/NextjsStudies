"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAllPosts, handleDeletePost } from "@/src/lib/service/post.service";
import { PostType } from "@/src/lib/schemas/post.schema";

const PAGE_SIZE = 10;

export default function usePostsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const posts = useQuery<PostType[]>({
    queryKey: ["posts"],
    queryFn: fetchAllPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: true,
  });

  const postsCount = posts.data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(postsCount / PAGE_SIZE));

  const paginatedPosts = useMemo(() => {
    if (!posts.data) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    return posts.data.slice(start, start + PAGE_SIZE);
  }, [posts.data, currentPage]);

  const deletePost = useMutation({
    mutationKey: ["deletePost"],
    mutationFn: (id: number) => handleDeletePost(id),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error("Erro ao excluir postagem");
        return;
      }
      toast.success("Postagem excluída com sucesso");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const onDelete = async (id: number) => {
    await deletePost.mutateAsync(id);
  };

  return {
    posts: paginatedPosts,
    postsCount,
    isPostsLoading: posts.isLoading,
    isPostsError: posts.isError,
    currentPage,
    setCurrentPage,
    totalPages,
    onDelete,
  };
}
