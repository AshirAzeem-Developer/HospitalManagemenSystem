interface VitalsFormProps {
  register: any;
  errors: any;
}

export default function VitalsForm({ register, errors }: VitalsFormProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-[var(--foreground)]">Vitals</h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Blood Pressure
          </label>

          <input
            {...register("bloodPressure")}
            placeholder="120/80"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-teal-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Temperature</label>

          <input
            {...register("temperature")}
            placeholder="98.6"
            type="number"
            step="0.1"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-teal-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Pulse Rate</label>

          <input
            {...register("pulseRate")}
            placeholder="72"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-teal-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Weight</label>

          <input
            {...register("weight")}
            placeholder="70 Kg"
            type="number"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-teal-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Height</label>

          <input
            {...register("height")}
            placeholder="175 cm"
            type="number"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-teal-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">SpO₂</label>

          <input
            {...register("spo2")}
            placeholder="98%"
            type="number"
            min={0}
            max={100}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-teal-500"
          />
        </div>
      </div>
    </div>
  );
}
