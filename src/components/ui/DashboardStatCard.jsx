const DashboardStatCard = ({ icon, percentage, title, value }) => {
  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm">
      <div className="flex justify-between">
        <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white">
          {icon}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="rounded-md bg-green-500 px-3 py-1 text-sm font-semibold text-white">
            {percentage}%
          </span>
          <p className="text-sm text-gray-400">in last 7 Days</p>
        </div>
      </div>
      <h3 className="mt-4 text-gray-500">{title}</h3>
      <h1 className="mt-1 text-4xl font-bold">{value}</h1>
    </div>
  );
};

export default DashboardStatCard;

// This component is currently rendered only on the Admin Dashboard (/admin).
// Doctor and Patient dashboards should also use this same component.
// Please render it in your respective dashboard pages
// and pass the appropriate data according to your module.
