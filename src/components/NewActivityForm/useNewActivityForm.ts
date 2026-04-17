"use client";
import {
  CreateActivity,
  createActivitySchema,
} from "@/src/lib/schemas/newActivity.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { useMutation } from "@tanstack/react-query";
import { handleCreateNewActivity } from "@/src/lib/service/activity.service";
import { toast } from "sonner";

// Create a type for the payload that excludes the file fields
type ActivityPayload = Omit<
  CreateActivity,
  "card_image_url" | "publicity_image_url"
>;

export function useNewActivityForm() {
  const dispatch = useDispatch();
  const [paymentRequired, setPaymentRequired] = useState(false);

  // ❌ REMOVED: const [activityImage, setActivityImage] = useState<File | null>(null);
  // React Hook Form now holds this state!

  const scheduleItems = useSelector((state: RootState) => state.schedule.items);
  const selectedFilters = useSelector(
    (state: RootState) => state.filter.filters
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue, // Ensure this is exported so the UI can use it
    control,
  } = useForm<CreateActivity>({
    resolver: zodResolver(
      createActivitySchema
    ) as unknown as Resolver<CreateActivity>,
  });

  const createActivity = useMutation({
    mutationKey: ["newActivity"],
    mutationFn: ({ payload, file }: { payload: ActivityPayload; file: File }) =>
      handleCreateNewActivity(payload, file),
    onSuccess: (result) => {
      if (!result.ok) {
        if (result.status === 409) {
          toast.error(result.message || "Conflito: Esta atividade já existe.");
          return;
        }

        toast.error(
          "Ocorreu um erro inesperado, por favor verifique sua conexão."
        );
        return;
      }
      toast.success("Atividade criada com sucesso");
    },
  });

  const onSubmit = async (data: CreateActivity) => {
    if (scheduleItems.length === 0) {
      toast.info("Adicione pelo menos uma data e horário.");
      return;
    }
    if (selectedFilters.length === 0) {
      toast.info("Selecione pelo menos um filtro.");
      return;
    }

    if (!data.card_image_url) {
      toast.info("Por favor, selecione uma imagem para a atividade.");
      return;
    }

    const { card_image_url, publicity_image_url, ...restOfData } = data;

    const payload: ActivityPayload = {
      ...restOfData,
      payment_required: paymentRequired,
      activities_dates: scheduleItems.map((item) => ({
        date: item.date,
        time: item.time,
      })),
      filters: selectedFilters.map((f) => ({ id: f.id })),
    };

    await createActivity.mutateAsync({
      payload,
      file: card_image_url as File,
    });
    // console.log(selectedFilters.map((f) => ({ id: f.id })));
  };

  return {
    handleSubmit,
    onSubmit,
    isSubmitting,
    errors,
    register,
    setValue, // You will pass this to onFileSelect in FormInputPhoto
    paymentRequired,
    setPaymentRequired,
    scheduleItems,
    selectedFilters,
  };
}
