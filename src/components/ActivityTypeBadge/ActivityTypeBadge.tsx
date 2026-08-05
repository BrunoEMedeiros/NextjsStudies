import { Badge } from "../ui/badge";
import { ACTIVITY_TYPE_LABELS } from "@/src/lib/activityType";

interface ActivityTypeBadgeProps {
  label: "event" | "course" | "ceremony";
}

const ActivityTypeBadge = ({ label }: ActivityTypeBadgeProps) => {
  return (
    <Badge
      variant={
        label == "event"
          ? "secondary"
          : label == "ceremony"
          ? "outline"
          : "default"
      }
      className="px-5 py-3"
    >
      <p className="font-light text-sm">{ACTIVITY_TYPE_LABELS[label]}</p>
    </Badge>
  );
};

export default ActivityTypeBadge;
