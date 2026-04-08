export default function LessonDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      <div className="h-6 w-64 bg-muted rounded-lg animate-pulse" />
      <div className="h-5 w-96 bg-muted rounded animate-pulse" />
      <div className="flex gap-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-1 h-10 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-2 bg-muted rounded-full animate-pulse" />
      <div className="h-96 bg-muted rounded-2xl animate-pulse" />
    </div>
  );
}
