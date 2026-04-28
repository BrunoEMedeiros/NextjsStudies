import { FilterType } from "@/src/lib/service/filter.service";

type ScheduleDates = {
  date: string;
  time: string;
};

type ActivityCard = {
  id: number;
  title: string;
  dates: ScheduleDates[];
  card_image_url: string;
  filters: FilterType[];
};

type ActivitiesListProps = {
  activities: ActivityCard[];
};

export default function ActivitiesList({ activities }: ActivitiesListProps) {
  return (
    <div>
      {activities.map((activity) => {
        return <p key={activity.id}>{activity.title}</p>;
      })}
    </div>
  );
}
