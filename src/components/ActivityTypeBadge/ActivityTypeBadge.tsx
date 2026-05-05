import { Badge } from "../ui/badge";

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
      <p className="font-light text-sm">
        {label == "event"
          ? "Evento"
          : label == "ceremony"
          ? "Cerimônia"
          : "Curso"}
      </p>
    </Badge>
  );
};

export default ActivityTypeBadge;
