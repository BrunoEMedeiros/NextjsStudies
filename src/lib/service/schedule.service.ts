"use server";

import { apiFetch } from "../api-client";

export type OccurrenceAttendee = {
  scheduleId: number;
  name: string;
  phone: string;
  modality: "online" | "presential" | string;
  personNumber: number;
  foodRestriction?: string;
  observation?: string;
  hasPaymentReceipt: boolean;
};

export type OccurrenceAttendees = {
  activityId: number;
  title: string;
  type: "event" | "course" | "ceremony";
  paymentRequired: boolean;
  date: string;
  time: string;
  totalSchedules: number;
  totalPeople: number;
  foodRestrictionsCount: number;
  attendees: OccurrenceAttendee[];
};

export const fetchOccurrenceAttendees = async (
  activityId: number,
  date: string,
  time: string
): Promise<OccurrenceAttendees> => {
  const { data } = await apiFetch<OccurrenceAttendees>(
    `/schedule/occurrence/${activityId}?date=${encodeURIComponent(
      date
    )}&time=${encodeURIComponent(time)}`
  );
  return data;
};
