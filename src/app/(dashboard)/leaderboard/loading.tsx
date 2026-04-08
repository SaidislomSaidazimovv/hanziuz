export default function LeaderboardLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="h-8 w-36 bg-muted rounded-lg animate-pulse" />
      <div className="h-5 w-56 bg-muted rounded animate-pulse" />
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="flex items-end justify-center gap-4 pt-8">
        <div className="w-28 h-40 bg-muted rounded-2xl animate-pulse" />
        <div className="w-32 h-48 bg-muted rounded-2xl animate-pulse" />
        <div className="w-28 h-36 bg-muted rounded-2xl animate-pulse" />
      </div>
      <div className="rounded-2xl border overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse border-b last:border-0" />
        ))}
      </div>
    </div>
  );
}
