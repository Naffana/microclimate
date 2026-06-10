// app/ui/date-filter.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
   const from = searchParams.get('dateFrom') || '';
    const to = searchParams.get('dateTo') || '';
    setDateFrom(from);
    setDateTo(to);
  }, [searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams();
    
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    
    const query = params.toString();
    router.push(`?${query}`);
  };

 const handleClear = () => {
    setDateFrom('');
    setDateTo('');
    router.push('?'); 
  };
  return (
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
      </div>
    </div>
  );
}