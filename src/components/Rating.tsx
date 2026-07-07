type RatingProps = {
  score: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

export function Rating({
  score,
  max = 10,
  size = "md",
  showLabel = true,
}: RatingProps) {
  const percentage = (score / max) * 100;
  const sizeClasses = {
    sm: "h-2",
    md: "h-2.5",
    lg: "h-3",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`relative w-24 overflow-hidden rounded-full bg-border ${sizeClasses[size]}`}
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`Rating: ${score} out of ${max}`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-brand-light"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-bold text-foreground">
          {score}/{max}
        </span>
      )}
    </div>
  );
}
