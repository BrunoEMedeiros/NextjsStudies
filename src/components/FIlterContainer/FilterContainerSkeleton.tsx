export function FilterContainerSkeleton() {
  return (
    <div className="col-span-2">
      {/* Section title */}
      <div className="w-16 h-5 rounded bg-gray-700 animate-pulse mb-2" />

      <div className="col-span-2 border rounded-md border-gray-700 p-4 flex flex-col gap-4">
        {/* Input + button row */}
        <div className="flex gap-2">
          <div className="w-1/4 h-10 rounded-md bg-gray-700 animate-pulse" />
          <div className="w-16 h-10 rounded-md bg-gray-700 animate-pulse" />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-full bg-gray-700 animate-pulse"
              style={{
                width: `${90 + (i % 3) * 30}px`, // vary chip widths naturally
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
