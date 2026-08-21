const DashboardStatCard = ({
  icon,
  title,
  value,
  iconBg,
  iconColor,
  valueColor,
}) => {
  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        dark:border-slate-700
        dark:bg-slate-900
      "
    >
      {/* Icon */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
 
      {/* Title */}
      <p className="mt-5 text-sm font-medium text-slate-600 dark:text-slate-300">
        {title}
      </p>
 
      {/* Value */}
      <h2 className={`mt-1 text-3xl font-bold ${valueColor} dark:text-white`}>
        {value}
      </h2>
    </div>
  );
};
 
export default DashboardStatCard;
 