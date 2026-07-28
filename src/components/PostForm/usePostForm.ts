"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  createPostSchema,
  CreatePost,
  PostType,
} from "@/src/lib/schemas/post.schema";
import { handleCreatePost, handleUpdatePost } from "@/src/lib/service/post.service";

type UsePostFormOptions = {
  editingPost?: PostType | null;
  onSuccess?: () => void;
};

const emptyValues: CreatePost = {
  title: "",
  text: "",
  image: undefined,
  file: undefined,
};

export function usePostForm({
  editingPost,
  onSuccess,
}: UsePostFormOptions = {}) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePost>({
    resolver: zodResolver(createPostSchema) as unknown as Resolver<CreatePost>,
    defaultValues: emptyValues,
  });

  const resetForm = () => {
    if (editingPost) {
      // File inputs can't be pre-filled by the browser, so only text
      // fields are restored; image/file stay empty (meaning "keep current").
      reset({
        title: editingPost.title,
        text: editingPost.text,
        image: undefined,
        file: undefined,
      });
      return;
    }
    reset(emptyValues);
  };

  useEffect(() => {
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPost]);

  const createPost = useMutation({
    mutationKey: ["createPost"],
    mutationFn: (payload: CreatePost) => handleCreatePost(payload),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.message || "Erro ao criar postagem");
        return;
      }
      toast.success("Postagem criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      reset(emptyValues);
      onSuccess?.();
    },
  });

  const updatePost = useMutation({
    mutationKey: ["updatePost"],
    mutationFn: ({ id, payload }: { id: number; payload: CreatePost }) =>
      handleUpdatePost(id, payload),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.message || "Erro ao atualizar postagem");
        return;
      }
      toast.success("Postagem atualizada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onSuccess?.();
    },
  });

  const onSubmit = async (data: CreatePost) => {
    if (editingPost) {
      await updatePost.mutateAsync({ id: editingPost.id, payload: data });
      return;
    }
    await createPost.mutateAsync(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting: isSubmitting || createPost.isPending || updatePost.isPending,
    onSubmit,
    resetForm,
  };
}
