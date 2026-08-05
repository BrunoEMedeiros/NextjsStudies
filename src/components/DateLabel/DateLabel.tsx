import React, { HTMLAttributes } from "react";

export type ActivityAvaliableDates = {
  date: string;
  time: string;
};
export type DateLabelProps = HTMLAttributes<Text> & {
  avaliable_activities: ActivityAvaliableDates[];
};

const DateLabel = ({ avaliable_activities }: DateLabelProps) => {
  if (avaliable_activities.length === 0) return null;

  const firstDate = avaliable_activities[0].date;
  const dateEquals = avaliable_activities.every(
    (item) => item.date === firstDate
  );

  const formatDate = (dateString: string) => {
    let date = new Date(dateString);

    const formatoBR = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return formatoBR.format(date);
  };

  if (dateEquals) {
    return (
      <p className="text-earth_yellow font-light text-center italic text-sm">
        Somente no dia {formatDate(avaliable_activities[0].date)}
      </p>
    );
  }

  return (
    <p
      className="text-earth_yellow font-light text-center text-sm italic truncate"
      title={`${formatDate(avaliable_activities[0].date)} até ${formatDate(
        avaliable_activities[avaliable_activities.length - 1].date
      )}`}
    >
      {formatDate(avaliable_activities[0].date)} até{" "}
      {formatDate(avaliable_activities[avaliable_activities.length - 1].date)}
    </p>
  );
};

export default DateLabel;
