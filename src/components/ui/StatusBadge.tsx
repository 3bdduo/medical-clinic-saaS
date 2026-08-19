export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-warning/15 text-warning border border-warning/20",
    confirmed: "bg-primary/15 text-primary border border-primary/20",
    completed: "bg-success/15 text-success border border-success/20",
    cancelled: "bg-danger/15 text-danger border border-danger/20",
  };
  const labels: Record<string, string> = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    completed: "مكتمل",
    cancelled: "ملغي",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? "bg-border text-text-secondary"}`}>
      {labels[status] ?? status}
    </span>
  );
}
