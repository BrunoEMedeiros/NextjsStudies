// Keyed as Record<string, string> (rather than Record<ActivityType, string>)
// because several call sites hold the type as a plain string, not the
// narrowed union.
export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  event: "Evento",
  course: "Curso",
  ceremony: "Cerimônia",
};

export const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  event: "#DBAD6C",
  course: "#6C9EDB",
  ceremony: "#6CDB8A",
};
