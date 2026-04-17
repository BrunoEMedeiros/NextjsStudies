"use client";

import { addScheduleItem } from "@/src/lib/feature/schedule/scheduleSlice";
import { fetchActivitiesByMonth } from "@/src/lib/service/activity.service";
import { RootState } from "@/src/lib/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { eachDayOfInterval } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

interface DateTimeActivityProps {
  date: string;
  time: string;
}

export interface ActivitiesByMonthType {
  date: string;
}

export function useDateTimeActivity() {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const scheduleItems = useSelector((state: RootState) => state.schedule.items);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [time, setTime] = useState("10:30:00");

  const [currentMonth, setCurrentMonth] = useState<Date>(
    dateRange?.from || new Date()
  );

  const {
    data: eventDays = [],
    isLoading,
    error,
  } = useQuery<Date[]>({
    queryKey: ["activitiesByMonth", currentMonth.getMonth()],
    queryFn: () => fetchActivitiesByMonth(currentMonth.getMonth()),
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: false,
    select: (fetchedDates) =>
      fetchedDates.map((date) => {
        const d = new Date(date);
        return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      }),
  });

  const handleAddNewItem = ({ date, time }: DateTimeActivityProps) => {
    const test = scheduleItems.some((item) => item.id == date + time);

    const data = new Date(date + "T00:00:00");

    const formattedDate = new Intl.DateTimeFormat("pt-BR").format(data);
    if (test) {
      toast.warning(`A data ${formattedDate} às ${time} ja foi adicionada`);
      return;
    }

    dispatch(
      addScheduleItem({
        id: date + time,
        date: date,
        time: time,
      })
    );
  };

  const handleAddDates = async () => {
    if (!dateRange || !dateRange.from) return;

    let datesToProcess: Date[] = [];

    if (dateRange.from && dateRange.to) {
      datesToProcess = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to,
      });
    } else {
      datesToProcess = [dateRange.from];
    }

    for (const dateObj of datesToProcess) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");

      const safeFormattedDate = `${year}-${month}-${day}`;

      handleAddNewItem({
        date: safeFormattedDate,
        time: time,
      });
    }
    queryClient.invalidateQueries({ queryKey: ["activitiesByMonth"] });
  };

  return {
    scheduleItems,
    handleAddNewItem,
    handleAddDates,
    dateRange,
    setDateRange,
    time,
    setTime,
    eventDays,
    isLoading,
    error,
    currentMonth,
    setCurrentMonth,
  };
}
