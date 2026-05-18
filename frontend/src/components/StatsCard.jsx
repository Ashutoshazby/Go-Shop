export const StatsCard = ({ icon: Icon, label, value, tone = 'bg-green-100 text-green-700' }) => (
  <div className="surface rounded-lg p-5">
    <div className={`mb-4 inline-flex rounded-md p-3 ${tone}`}>
      <Icon size={22} />
    </div>
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-1 text-2xl font-black">{value}</p>
  </div>
);
