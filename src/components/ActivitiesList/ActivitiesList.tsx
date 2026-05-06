import { FilterType } from "@/src/lib/service/filter.service";
import ActivityCard from "../ActivityCard/ActivityCard";
import ActivityCardSkeleton from "../ActivityCard/ActivityCardSkeleton";

type ScheduleDates = {
  date: string;
  time: string;
};

export type ActivityCardProps = {
  id: number;
  title: string;
  Dates: ScheduleDates[];
  card_image_url: string;
  type: "event" | "course" | "ceremony";
  status: number;
  filters: FilterType[];
};

type ActivitiesListProps = {
  activities: ActivityCardProps[];
  isLoading?: boolean;
};

export default function ActivitiesList({
  activities,
  isLoading,
}: ActivitiesListProps) {
  if (isLoading)
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ActivityCardSkeleton key={i} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-wrap gap-3">
      {activities.map((activity) => (
        <ActivityCard
          id={activity.id}
          key={activity.id.toString()}
          title={activity.title}
          type={activity.type}
          status={activity.status}
          Dates={activity.Dates}
          filters={activity.filters}
          card_image_url={activity.card_image_url}
        />
      ))}
    </div>
  );
}
