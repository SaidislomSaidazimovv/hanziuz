export default function AchievementsLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="h-8 w-40 bg-muted rounded-lg animate-pulse" />
      <div className="h-5 w-64 bg-muted rounded animate-pulse" />
      <div className="h-24 bg-muted rounded-2xl animate-pulse" />
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-20 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-44 bg-muted rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
