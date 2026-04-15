import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";

type PageStateVariant = "loading" | "empty" | "error";

interface PageStateCardProps {
  variant?: PageStateVariant;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  compact?: boolean;
  icon?: React.ReactNode;
}

const defaultIcons: Record<PageStateVariant, React.ReactNode> = {
  loading: <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />,
  empty: <Inbox className="mx-auto h-10 w-10 text-muted-foreground/30" />,
  error: <AlertCircle className="mx-auto h-10 w-10 text-destructive/70" />,
};

const PageStateCard: React.FC<PageStateCardProps> = ({
  variant = "empty",
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  compact = false,
  icon,
}) => {
  return (
    <div
      className={cn(
        "surface-card rounded-3xl text-center text-muted-foreground",
        compact ? "px-6 py-8" : "px-8 py-10",
        className
      )}
    >
      {icon ?? defaultIcons[variant]}
      <p className={cn("font-medium text-foreground", compact ? "mt-3 text-sm" : "mt-3 text-base")}>{title}</p>
      {description ? (
        <p className={cn("mx-auto text-muted-foreground", compact ? "mt-1 text-sm leading-6" : "mt-2 max-w-sm text-sm leading-6")}>
          {description}
        </p>
      ) : null}
      {(actionLabel && onAction) || (secondaryActionLabel && onSecondaryAction) ? (
        <div className="mt-5 flex justify-center gap-2">
          {actionLabel && onAction ? (
            <Button className="app-btn-primary" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
          {secondaryActionLabel && onSecondaryAction ? (
            <Button variant="outline" className="app-btn-secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default PageStateCard;
