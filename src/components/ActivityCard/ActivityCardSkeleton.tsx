const ActivityCardSkeleton = () => {
  return (
    <div className="bg-rich-black w-60 border rounded-md border-gray-700 flex flex-col items-center justify-between p-4 gap-3 animate-pulse">
      {/* image */}
      <div className="w-full h-40 rounded-sm bg-gray-700" />

      {/* title */}
      <div className="w-3/4 h-4 rounded bg-gray-700" />

      {/* badge + switch */}
      <div className="w-full flex justify-center gap-3">
        <div className="w-16 h-6 rounded-full bg-gray-700" />
        <div className="w-20 h-6 rounded-full bg-gray-700" />
      </div>

      {/* dates */}
      <div className="w-full flex flex-col gap-2">
        <div className="w-full h-4 rounded bg-gray-700" />
        <div className="w-2/3 h-4 rounded bg-gray-700" />
      </div>

      {/* buttons */}
      <div className="flex gap-4">
        <div className="w-16 h-8 rounded-md bg-gray-700" />
        <div className="w-16 h-8 rounded-md bg-gray-700" />
      </div>
    </div>
  );
};

export default ActivityCardSkeleton;
