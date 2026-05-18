export const ProductSkeleton = () => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div className="surface rounded-lg p-3" key={index}>
        <div className="skeleton aspect-[4/3]" />
        <div className="mt-4 h-4 w-2/3 skeleton" />
        <div className="mt-3 h-4 w-1/3 skeleton" />
      </div>
    ))}
  </div>
);
