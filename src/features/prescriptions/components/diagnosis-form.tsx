interface DiagnosisFormProps {
  register: any;
}

export default function DiagnosisForm({ register }: DiagnosisFormProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Diagnosis</h2>

      <textarea
        rows={5}
        {...register("diagnosis")}
        placeholder="Write diagnosis..."
        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-teal-500"
      />
    </div>
  );
}
