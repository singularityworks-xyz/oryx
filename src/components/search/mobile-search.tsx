'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { mockProducts } from '@/data/mock-data';

export default function MobileSearch({
  autoFocus,
  onClose,
  containerMaxWidthClass = 'max-w-[1240px]',
  squareImages = false,
  lastPurchasedMap,
  compact = false,
}: {
  autoFocus?: boolean;
  onClose?: () => void;
  containerMaxWidthClass?: string;
  squareImages?: boolean;
  lastPurchasedMap?: Record<string, string>;
  compact?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(['plate', 'golden', 'white']);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // biome-ignore lint/style/noMagicNumbers: TODO - Admin panel
      return mockProducts.slice(0, 6);
    }
    return (
      mockProducts
        .filter((p) =>
          [p.name, ...p.tags, ...p.categories].some((t) =>
            t.toLowerCase().includes(q)
          )
        )
        // biome-ignore lint/style/noMagicNumbers: TODO - ADMIN panel
        .slice(0, 8)
    );
  }, [query]);

  const clearRecent = () => setRecent([]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      return;
    }
    setRecent((prev) =>
      // biome-ignore lint/style/noMagicNumbers: TODO - ADMIN panel
      [query, ...prev.filter((x) => x !== query)].slice(0, 6)
    );
  };

  const formatDate = (iso?: string) => {
    if (!iso) {
      return '';
    }
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return iso;
    }
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white">
      <form className="border-gray-200 border-t px-0 py-3" onSubmit={onSubmit}>
        <div
          className={`mx-auto flex w-full ${containerMaxWidthClass} items-center space-x-3 border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100`}
        >
          <Search className="h-5 w-5 flex-shrink-0" />
          <input
            className="w-full bg-transparent font-light font-outfit text-sm outline-none placeholder:text-gray-400"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            ref={inputRef}
            value={query}
          />
          <button className="hidden" type="submit" />
        </div>
      </form>

      <div
        className={`mx-auto ${containerMaxWidthClass} space-y-4 px-4 pb-4 sm:px-6 lg:px-8`}
      >
        {recent.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-light font-outfit text-gray-900 text-sm">
                Recent searches
              </h3>
              <button
                className="font-light font-outfit text-gray-600 text-xs underline"
                onClick={clearRecent}
                type="button"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recent.map((term) => (
                <button
                  className="border-gray-300 bg-white px-3 py-1 font-light font-outfit text-gray-700 text-xs hover:bg-gray-50"
                  key={term}
                  onClick={() => setQuery(term)}
                  type="button"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-2 font-light font-outfit text-gray-900 text-sm">
            Products
          </h3>
          {filtered.length === 0 ? (
            <p className="font-light font-outfit text-gray-600 text-sm">
              No products found.
            </p>
          ) : (
            <div
              className={
                compact
                  ? 'grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
                  : 'grid grid-cols-2 gap-3 sm:grid-cols-3'
              }
            >
              {/** biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Hmmm */}
              {filtered.map((p) => (
                <Link
                  className={
                    compact
                      ? 'group block border border-gray-200 bg-white p-1.5 transition-shadow hover:shadow-sm'
                      : 'group block border border-gray-200 bg-white p-2 transition-shadow hover:shadow-sm'
                  }
                  href={`/products/${p._id}`}
                  key={p._id}
                  onClick={onClose}
                >
                  {squareImages ? (
                    <div className="relative aspect-square w-full bg-gray-50">
                      <Image
                        alt={p.name}
                        className="object-cover"
                        fill
                        src={p.images[0]}
                      />
                    </div>
                  ) : (
                    <div className="overflow-hidden bg-gray-50">
                      <Image
                        alt={p.name}
                        className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        height={112}
                        src={p.images[0]}
                        width={112}
                      />
                    </div>
                  )}
                  <p
                    className={
                      compact
                        ? 'mt-2 truncate font-light font-outfit text-gray-900 text-xs'
                        : 'mt-2 truncate font-light font-outfit text-gray-900 text-sm'
                    }
                  >
                    {p.name}
                  </p>
                  <p
                    className={
                      compact
                        ? 'font-light font-outfit text-[10px] text-gray-600'
                        : 'font-light font-outfit text-gray-600 text-xs'
                    }
                  >
                    QAR {p.sellingPrice.toFixed(2)}
                  </p>
                  {lastPurchasedMap?.[p._id] && (
                    <p
                      className={
                        compact
                          ? 'mt-0.5 font-light font-outfit text-[9px] text-gray-500'
                          : 'mt-0.5 font-light font-outfit text-[10px] text-gray-500'
                      }
                    >
                      Last purchased on {formatDate(lastPurchasedMap[p._id])}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
