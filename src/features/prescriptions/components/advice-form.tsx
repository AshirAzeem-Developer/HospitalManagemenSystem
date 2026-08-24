interface AdviceFormProps {
  register: any;
}

export default function AdviceForm({ register }: AdviceFormProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold text-[var(--foreground)]">Advice</h2>

      <textarea
        rows={5}
        {...register("advice")}
        placeholder="Write patient advice..."
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-teal-500"
      />
    </div>
  );
}
