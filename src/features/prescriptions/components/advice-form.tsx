interface AdviceFormProps {
  register: any;
}

export default function AdviceForm({ register }: AdviceFormProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Advice</h2>

      <textarea
        rows={5}
        {...register("advice")}
        placeholder="Write patient advice..."
        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-teal-500"
      />
    </div>
  );
}
