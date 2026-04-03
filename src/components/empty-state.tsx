import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <div>
        <p className="font-medium text-gray-700">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
