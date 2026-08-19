interface DiagnosisFormProps {
  register: any;
}

export default function DiagnosisForm({ register }: DiagnosisFormProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold text-[var(--foreground)]">Diagnosis</h2>

      <textarea
        rows={5}
        {...register("diagnosis")}
        placeholder="Write diagnosis..."
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-teal-500"
      />
    </div>
  );
}
