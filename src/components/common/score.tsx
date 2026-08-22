import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function scoreTone(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-brand-deep";
  return "text-muted-foreground";
}

export function MatchBadge({ score, className }: { score: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-deep",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", score >= 80 ? "bg-success" : "bg-primary")} />
      {score}% Match
    </span>
  );
}

export function ScoreBar({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className={cn("text-sm font-semibold tabular-nums", scoreTone(value))}>{value}%</span>
      </div>
      <Progress value={value} className="mt-2 h-2" aria-label={`${label}: ${value}%`} />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ScoreRing({
  value,
  label,
  size = 96,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} role="img" aria-label={`${label}: ${value}%`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={8}
          className="stroke-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className="fill-brand-deep text-lg font-semibold"
        >
          {value}%
        </text>
      </svg>
      <div>
        <p className="text-sm font-semibold text-brand-deep">{label}</p>
        <p className="text-xs text-muted-foreground">Estimativa de compatibilidade</p>
      </div>
    </div>
  );
}
