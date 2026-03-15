export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="skeleton h-5 w-28 rounded-md" />
        <div className="skeleton h-4 w-16 rounded-md" />
      </div>
      <div className="p-5 space-y-2">
        <div className="skeleton h-4 w-full rounded-md" />
        <div className="skeleton h-4 w-5/6 rounded-md" />
        <div className="skeleton h-4 w-4/6 rounded-md" />
      </div>
      <div className="px-5 pb-4 flex gap-2">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-3 w-20 rounded-full" />
        <div className="skeleton h-3 w-12 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="flex gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass rounded-xl px-5 py-3 flex-1">
          <div className="skeleton h-3 w-20 rounded mb-2" />
          <div className="skeleton h-7 w-12 rounded" />
        </div>
      ))}
    </div>
  );
}
