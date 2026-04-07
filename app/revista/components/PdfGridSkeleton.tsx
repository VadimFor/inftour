export default function PdfGridSkeleton() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-6">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col rounded-sm w-full lg:w-[calc(50%-12px)] lg:shrink-0 animate-pulse"
        >
          <div className="h-48 bg-gray-200" />
          <div className="p-6 flex flex-col gap-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
