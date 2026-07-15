"use server";

import { apiFetch } from "../api-client";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { buildQueryParams } from "./activity.service";

export type ActivityType = "event" | "course" | "ceremony";
export type UserRoleFilter = "regular" | "maintainer" | "administrative";

export type ScheduleByUserReportItem = {
  id: number;
  modality: string;
  personNumber: number;
  foodRestriction?: string;
  observation?: string;
  activity: {
    id: number;
    title: string;
    type: ActivityType;
    payment_required: boolean;
    payment_sugestion: number;
  };
  slots: { availableData: string; availableTime: string }[];
};

export type UserByRoleReportItem = {
  id: string;
  name: string;
  dharmaName: string | null;
  email: string;
  phone: string;
  role: UserRoleFilter;
  status: number;
  createdAt: string;
};

export type ActivitiesReportFilters = {
  dateFrom?: Date;
  dateTo?: Date;
  type?: ActivityType;
  paymentRequired?: boolean;
  description?: string;
  filterIds?: number[];
};

export type ActivityReportItem = {
  id: number;
  title: string;
  description: string;
  type: ActivityType;
  payment_required: boolean;
  payment_sugestion: number;
  status: number;
  createdAt: string;
  scheduleCount: number;
  expectedRevenue: number;
  filters: { id: number; descricao: string }[];
};

export type SchedulesReportFilters = {
  dateFrom?: Date;
  dateTo?: Date;
  activityId?: number;
};

export type ScheduleReportItem = {
  id: number;
  modality: string;
  personNumber: number;
  foodRestriction?: string;
  activity: { id: number; title: string; type: ActivityType };
  member: {
    id: string;
    name: string;
    dharmaName: string | null;
    phone: string;
    email: string;
  };
  slots: { availableData: string; availableTime: string }[];
};

export type DashboardReport = {
  activeUsers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRoleFilter;
  }[];
  activeUsersCount: number;
  activityTypeBreakdown: { type: ActivityType; count: number }[];
  activitiesPerMonth: { month: string; count: number }[];
  schedulesPerMonth: { month: string; count: number }[];
  expectedRevenuePerMonth: { month: string; revenue: number }[];
  schedulesByActivityType: { type: ActivityType; count: number }[];
  schedulesByFilter: { filterId: number; descricao: string; count: number }[];
};

export const fetchSchedulesByUserReport = async (
  userId: string
): Promise<ScheduleByUserReportItem[]> => {
  try {
    const { data } = await apiFetch<ScheduleByUserReportItem[]>(
      `/reports/schedules-by-user?userId=${encodeURIComponent(userId)}`
    );
    return data;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    throw error;
  }
};

export const fetchUsersByRoleReport = async (
  role?: UserRoleFilter
): Promise<UserByRoleReportItem[]> => {
  try {
    const query = await buildQueryParams({ role });
    const { data } = await apiFetch<UserByRoleReportItem[]>(
      `/reports/users-by-role${query}`
    );
    return data;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    throw error;
  }
};

export const fetchActivitiesReport = async (
  filters: ActivitiesReportFilters
): Promise<ActivityReportItem[]> => {
  try {
    const { filterIds, ...rest } = filters;
    const query = await buildQueryParams({
      ...rest,
      filterIds: filterIds && filterIds.length > 0 ? filterIds.join(",") : undefined,
    });
    const { data } = await apiFetch<ActivityReportItem[]>(
      `/reports/activities${query}`
    );
    return data;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    throw error;
  }
};

export const fetchSchedulesReport = async (
  filters: SchedulesReportFilters
): Promise<ScheduleReportItem[]> => {
  try {
    const query = await buildQueryParams({ ...filters });
    const { data } = await apiFetch<ScheduleReportItem[]>(
      `/reports/schedules${query}`
    );
    return data;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    throw error;
  }
};

export const fetchDashboardReport = async (): Promise<DashboardReport> => {
  try {
    const { data } = await apiFetch<DashboardReport>("/reports/dashboard");
    return data;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    throw error;
  }
};
