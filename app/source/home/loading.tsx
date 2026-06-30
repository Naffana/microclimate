export default function Loading() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-center mt-5 shrink-0">
        <div className="mb-4 flex flex-row gap-2">
          <div className="bg-border p-2 rounded-4xl shadow-md w-36 h-10 animate-pulse" />
          <p className="flex items-center font-medium text-2xl">-</p>
          <div className="bg-border p-2 rounded-4xl shadow-md w-36 h-10 animate-pulse" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
        Загрузка данных...
      </div>
    </div>
  );
}
