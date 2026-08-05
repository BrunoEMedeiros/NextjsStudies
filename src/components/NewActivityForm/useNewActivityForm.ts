"use client";
import {
  CreateActivity,
  createActivitySchema,
} from "@/src/lib/schemas/newActivity.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleCreateNewActivity } from "@/src/lib/service/activity.service";
import { toast } from "sonner";
import {
  clearSchedule,
  setScheduleItems,
} from "@/src/lib/feature/schedule/scheduleSlice";
import {
  clearFilter,
  setFilterItem,
} from "@/src/lib/feature/filter/filterSlice";
import {
  ActivityDetails,
  handleUpdateActivity,
} from "@/src/lib/service/activity.service";
import {
  UpdateActivity,
  updateActivitySchema,
} from "@/src/lib/schemas/updateActivity.schema";
import { isEqual, cloneDeep } from "lodash-es";

type ActivityPayload = Omit<
  CreateActivity,
  "card_image_url" | "publicity_image_url"
>;

type NewActivityFormOptions = {
  editingActivity?: ActivityDetails | null;
  onEditComplete?: () => void;
};

export function useNewActivityForm({
  editingActivity,
  onEditComplete,
}: NewActivityFormOptions = {}) {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const scheduleItems = useSelector((state: RootState) => state.schedule.items);
  const selectedFilters = useSelector(
    (state: RootState) => state.filter.filters
  );

  // Edit mode must validate against updateActivitySchema (image optional,
  // no "required" refine) instead of createActivitySchema. The ref keeps the
  // resolver identity stable while always reading the latest edit state.
  const editingActivityRef = useRef(editingActivity);
  useEffect(() => {
    editingActivityRef.current = editingActivity;
  }, [editingActivity]);

  const resolver: Resolver<CreateActivity> = useCallback((values, context, options) => {
    const schema = editingActivityRef.current
      ? updateActivitySchema
      : createActivitySchema;
    return (
      zodResolver(schema as unknown as typeof createActivitySchema) as unknown as Resolver<CreateActivity>
    )(values, context, options);
  }, []);

  const resetForm = () => {
    reset(); // clears react-hook-form fields
    setPaymentRequired(false);
    dispatch(clearSchedule()); // clears DateTimeSchedule chips
    dispatch(clearFilter()); // clears FilterChip selections
    setResetKey((k) => k + 1); // ← forces FormInputPhoto remount
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    setValue,
    control,
  } = useForm<CreateActivity>({
    resolver,
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
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      resetForm();
      return;
    },
  });

  useEffect(() => {
    if (!editingActivity) return;

    reset({
      title: editingActivity.title,
      description: editingActivity.description,
      social_media_url: editingActivity.social_media_url,
      activity_link: editingActivity.activity_link,
      activity_link_info: editingActivity.activity_link_info,
      payment_sugestion: editingActivity.payment_sugestion,
      type: editingActivity.type,
    });

    setPaymentRequired(editingActivity.payment_required);

    dispatch(
      setScheduleItems(
        (editingActivity.Dates ?? []).map((d) => {
          const dateOnly = d.date.split("T")[0];
          return {
            id: dateOnly + d.time,
            date: dateOnly,
            time: d.time,
          };
        })
      )
    );

    dispatch(
      setFilterItem(
        (editingActivity.filters ?? []).map((f) => ({
          id: f.id,
          descricao: f.descricao,
        }))
      )
    );
  }, [editingActivity, reset, dispatch]);

  const updateActivity = useMutation({
    mutationKey: ["updateActivity"],
    mutationFn: ({
      id,
      payload,
      file,
    }: {
      id: number;
      payload: UpdateActivity;
      file?: File;
    }) => handleUpdateActivity(id, payload, file),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.message || "Erro ao atualizar.");
        return;
      }
      toast.success("Atividade atualizada!");
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      onEditComplete?.();
      resetForm();
      return;
    },
  });

  const onSubmit = async (data: CreateActivity) => {
    if (scheduleItems.length === 0) {
      toast.info("Adicione pelo menos uma data.");
      return;
    }
    if (selectedFilters.length === 0) {
      toast.info("Selecione pelo menos um filtro.");
      return;
    }

    if (editingActivity) {
      const newFile =
        data.card_image_url instanceof File ? data.card_image_url : undefined;

      let payload = {};
      if (data.title != editingActivity.title) {
        payload = { title: data.title };
      }

      if (data.description != editingActivity.description) {
        payload = { ...payload, description: data.description };
      }

      if (data.social_media_url != editingActivity.social_media_url) {
        payload = { ...payload, social_media_url: data.social_media_url };
      }

      if (data.activity_link != editingActivity.activity_link) {
        payload = { ...payload, activity_link: data.activity_link };
      }

      if (data.activity_link_info != editingActivity.activity_link_info) {
        payload = {
          ...payload,
          activity_link_info: data.activity_link_info,
        };
      }

      if (paymentRequired != editingActivity.payment_required) {
        payload = {
          ...payload,
          payment_required: paymentRequired,
        };
      }

      if (data.payment_sugestion != editingActivity.payment_sugestion) {
        payload = { ...payload, payment_sugestion: data.payment_sugestion };
      }

      if (data.type != editingActivity.type) {
        payload = {
          ...payload,
          type: data.type,
        };
      }

      const activities_dates = scheduleItems.map((i) => ({
        date: i.date,
        time: i.time,
      }));

      const editing_dates = editingActivity.Dates.map((d) => {
        const dateOnly = d.date.split("T")[0];
        return {
          date: dateOnly,
          time: d.time,
        };
      });

      if (!isEqual(activities_dates, editing_dates)) {
        payload = {
          ...payload,
          activities_dates: scheduleItems.map((i) => ({
            date: i.date,
            time: i.time,
          })),
        };
      }
      const form_filters = selectedFilters.map((f) => ({
        id: f.id,
        descricao: f.descricao,
      }));

      if (!isEqual(form_filters, editingActivity.filters)) {
        payload = {
          ...payload,
          filters: selectedFilters.map((f) => ({ id: f.id })),
        };
      }

      if (Object.keys(payload).length === 0 && newFile == undefined) {
        onEditComplete?.();
        return;
      }

      await updateActivity.mutateAsync({
        id: editingActivity.id,
        payload,
        file: newFile,
      });
      return;
    }

    if (!data.card_image_url) {
      toast.info("Selecione uma imagem.");
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

    await createActivity.mutateAsync({ payload, file: card_image_url as File });
  };

  return {
    handleSubmit,
    onSubmit,
    isSubmitting,
    errors,
    register,
    setValue,
    paymentRequired,
    setPaymentRequired,
    resetKey,
  };
}
