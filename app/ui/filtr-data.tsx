// app/ui/date-filter.tsx
'use client';
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [navigating, setNavigating] = useState(false);
  const [isRefreshing, startTransition] = useTransition();

  useEffect(() => {
   const from = searchParams.get('dateFrom') || '';
    const to = searchParams.get('dateTo') || '';
    setDateFrom(from);
    setDateTo(to);
    setNavigating(false);
  }, [searchParams]);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleApply = () => {
    const currentFrom = searchParams.get('dateFrom') || '';
    const currentTo = searchParams.get('dateTo') || '';
    if (dateFrom === currentFrom && dateTo === currentTo) return;

    setNavigating(true);
    const params = new URLSearchParams();
    
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    
    const query = params.toString();
    router.push(`?${query}`);
  };

 const handleClear = () => {
    const currentFrom = searchParams.get('dateFrom') || '';
    const currentTo = searchParams.get('dateTo') || '';
    if (!currentFrom && !currentTo) {
      setDateFrom('');
      setDateTo('');
      return;
    }
    setNavigating(true);
    setDateFrom('');
    setDateTo('');
    router.push('?');
  };
  return (
    <>
    {(navigating || isRefreshing) && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        <div className="text-gray-500 text-lg">Загрузка данных...</div>
      </div>
    )}
     <div className="mb-4 flex flex-row gap-2">
      <div className="flex gap-2">
        <div className="flex flex-col">
          <input 
            className="bg-border p-2 cursor-pointer rounded-4xl shadow-md" 
            type="date" 
            id="dateFrom"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <p className='flex items-center font-medium text-2xl'>-</p>
        <div className="flex flex-col">
          <input 
            className="bg-border p-2 cursor-pointer rounded-4xl shadow-md" 
            type="date" 
            id="dateTo"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={handleApply}
          className="bg-accent px-4 cursor-pointer rounded-lg text-secondary font-bold"
        >
          ✓
        </button>
        
        <button 
          onClick={handleClear}
          className="bg-accent-red px-4 cursor-pointer rounded-lg text-secondary font-bold"
        >
          Х
        </button>
        <button 
          onClick={handleRefresh}
          className="bg-border  px-4 cursor-pointer rounded-lg text-accent font-bold"
        >
          <ArrowPathIcon className="h-5 w-5"/>
        </button>
      </div>
    </div>
    </>
  );
}