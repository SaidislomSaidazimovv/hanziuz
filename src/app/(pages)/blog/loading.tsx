export default function BlogLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-muted animate-pulse mx-auto" />
        <div className="h-9 w-24 bg-muted rounded-lg animate-pulse mx-auto" />
        <div className="h-5 w-72 bg-muted rounded animate-pulse mx-auto" />
      </div>
      <div className="flex justify-center gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-muted animate-pulse">
            <div className="h-40" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-20 bg-muted-foreground/10 rounded" />
              <div className="h-5 w-full bg-muted-foreground/10 rounded" />
              <div className="h-4 w-3/4 bg-muted-foreground/10 rounded" />
              <div className="h-3 w-40 bg-muted-foreground/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
