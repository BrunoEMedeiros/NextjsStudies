import Image from "next/image";

export function DashBoardNavBarSkeleton() {
  return (
    <div className="w-1/6 min-w-50 bg-rich-black text-white pt-8 sticky top-0 h-screen border-r border-gray-800">
      <div className="flex justify-center items-center h-20">
        <Image
          src="/Logo_Zenrp.png"
          width={75}
          height={75}
          alt="Logotipo"
          priority
          unoptimized
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-4 mb-6 px-4">
        <div className="h-4 w-28 rounded bg-gray-700 animate-pulse" />
        <div className="w-25 h-25 rounded-full bg-gray-700 animate-pulse border-2 border-gray-600" />
        <div className="h-5 w-20 rounded-full bg-gray-700 animate-pulse" />
      </div>
      <div className="flex flex-col gap-2 px-4 mt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-md bg-gray-700 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }} // staggered feel
          />
        ))}
      </div>
    </div>
  );
}
