export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="h-8 w-56 bg-muted rounded-lg animate-pulse" />
      <div className="h-5 w-80 bg-muted rounded animate-pulse" />
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="h-28 bg-muted rounded-2xl animate-pulse" />
        <div className="h-28 bg-muted rounded-2xl animate-pulse" />
      </div>
      <div className="h-32 bg-muted rounded-2xl animate-pulse" />
      <div className="h-5 w-32 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="h-48 bg-muted rounded-2xl animate-pulse" />
        <div className="h-48 bg-muted rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
