"use server";

import { apiFetch } from "../api-client";

export type FilterType = {
  id: number;
  descricao: string;
};

export const fetchAllFilters = async () => {
  const { data } = await apiFetch<FilterType[]>("/filters", {
    method: "GET",
  });

  return data;
};
