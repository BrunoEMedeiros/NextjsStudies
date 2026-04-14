export function DateTimeActivityCalendarSkeleton() {
  return (
    <div className="flex flex-col gap-3 col-span-1 w-full">
      <div className="mx-auto w-fit rounded-lg border border-gray-800 bg-card overflow-hidden">
        {/* Calendar header: month nav + label */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="w-7 h-7 rounded bg-gray-700 animate-pulse" />
          <div className="w-32 h-7 rounded bg-gray-700 animate-pulse" />
          <div className="w-7 h-7 rounded bg-gray-700 animate-pulse" />
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-1 px-4 pb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-12 h-5 mx-0.5 rounded bg-gray-700 animate-pulse"
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>

        {/* Day cells — 5 rows × 7 cols */}
        <div className="grid grid-cols-7 gap-1 px-4 pb-4">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 mx-0.5 rounded-lg bg-gray-700 animate-pulse"
              style={{ animationDelay: `${(i % 7) * 40}ms` }}
            />
          ))}
        </div>

        {/* Footer: time input */}
        <div className="border-t border-gray-800 bg-card rounded-b-lg px-4 py-3 flex flex-col gap-2">
          <div className="w-16 h-4 rounded bg-gray-700 animate-pulse" />
          <div className="w-full h-10 rounded bg-gray-700 animate-pulse" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-2 mt-2">
        <div className="w-16 h-10 rounded bg-gray-700 animate-pulse" />
        <div
          className="w-16 h-10 rounded bg-gray-700 animate-pulse"
          style={{ animationDelay: "80ms" }}
        />
      </div>
    </div>
  );
}
