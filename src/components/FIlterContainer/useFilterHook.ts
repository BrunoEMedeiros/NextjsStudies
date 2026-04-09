"use client";

import {
  newFilterSchema,
  NewFilterType,
} from "@/src/lib/schemas/newFilter.schema";
import {
  fetchAllFilters,
  FilterType,
  handleCreateNewFilter,
  handleDeleteFilter,
  handleUpdateFilter,
} from "@/src/lib/service/filter.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

export function useFiltersHook() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<NewFilterType>({
    resolver: zodResolver(
      newFilterSchema
    ) as unknown as Resolver<NewFilterType>,
  });

  const { data, isLoading, error } = useQuery<FilterType[]>({
    queryKey: ["filters"],
    queryFn: () => fetchAllFilters(),
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: false,
  });

  const createNewFilter = useMutation({
    mutationKey: ["newFilter"],
    mutationFn: (descricao: string) => handleCreateNewFilter(descricao),
    onSuccess: (result) => {
      if (!result.ok) {
        if (result.status === 409) {
          setError("descricao", { type: "manual", message: result.message });
          return;
        }
        toast.error(
          "Ocorreu um erro inesperado, por favor verifique sua conexão."
        );
        return;
      }
      toast.success("Filtro criado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["filters"] });
    },
  });

  const deleteFilter = useMutation({
    mutationKey: ["deleteFilter"],
    mutationFn: (id: number) => handleDeleteFilter(id),
    onSuccess: (result) => {
      if (!result.ok) {
        if (result.status === 409) {
          toast.error(
            "O filtro não pode ser excluido porque já está associado a uma atividade ativa"
          );
        }

        return;
      }
      toast.success("Filtro excluido com sucesso");
      queryClient.invalidateQueries({ queryKey: ["filters"] });
    },
  });

  const updateFilter = useMutation({
    mutationKey: ["updateFilter"],
    mutationFn: ({ id, descricao }: FilterType) =>
      handleUpdateFilter({ id, descricao }),
    onSuccess: (result) => {
      if (!result.ok) {
        if (result.status === 409) {
          toast.error("Já existe um filtro com este nome");
        }

        return;
      }
      toast.success("Filtro atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["filters"] });
    },
  });

  const onUpdate = async ({ id, descricao }: FilterType) => {
    await updateFilter.mutateAsync({ id, descricao });
  };

  const onDelete = async (id: number) => {
    await deleteFilter.mutateAsync(id);
  };

  const onSubmit = async (data: NewFilterType) => {
    await createNewFilter.mutateAsync(data.descricao);
  };

  return {
    filters: data || [],
    onSubmit,
    isSubmitting,
    register,
    handleSubmit,
    errors,
    onDelete,
    onUpdate,
  };
}
