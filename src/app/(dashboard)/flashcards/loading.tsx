export default function FlashcardsLoading() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex justify-between">
        <div className="h-7 w-36 bg-muted rounded-lg animate-pulse" />
        <div className="h-5 w-20 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-2 bg-muted rounded-full animate-pulse" />
      <div className="h-80 bg-muted rounded-3xl animate-pulse" />
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
