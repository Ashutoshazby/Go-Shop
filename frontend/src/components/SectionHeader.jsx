export const SectionHeader = ({ eyebrow, title, copy }) => (
  <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div>
      {eyebrow && <p className="text-sm font-black uppercase text-accent">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">{title}</h2>
    </div>
    {copy && <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">{copy}</p>}
  </div>
);
