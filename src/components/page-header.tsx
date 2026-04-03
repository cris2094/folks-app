import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50",
  action,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
