export function Card({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <p className="text-sm font-medium text-muted">{label}</p>

      <p className="mt-2 text-2xl font-semibold text-foreground">
        {value}
      </p>

      {hint && (
        <p className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
