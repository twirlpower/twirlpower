'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import styles from './FilterBar.module.css';

type FilterOption = { value: string; label: string };
type Filter = {
  name: string;
  label: string;
  options: FilterOption[];
  value: string;
};

type Props = {
  filters: Filter[];
  searchName?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  extraParams?: Record<string, string>;
};

export default function FilterBar({
  filters,
  searchName,
  searchValue,
  searchPlaceholder,
  extraParams = {},
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      // Preserve extra params
      Object.entries(extraParams).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, extraParams]
  );

  const clearAll = () => router.push(pathname);
  const hasFilters = filters.some(f => f.value) || (searchValue ?? '');

  return (
    <div className={styles.bar}>
      {searchName && (
        <input
          type="search"
          placeholder={searchPlaceholder ?? 'Search...'}
          defaultValue={searchValue}
          className={styles.search}
          onChange={e => {
            const val = e.target.value;
            // Debounce slightly
            const t = setTimeout(() => updateParam(searchName, val), 300);
            return () => clearTimeout(t);
          }}
        />
      )}

      {filters.map(f => (
        <select
          key={f.name}
          value={f.value}
          className={styles.select}
          onChange={e => updateParam(f.name, e.target.value)}
        >
          <option value="">All {f.label}s</option>
          {f.options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ))}

      {hasFilters && (
        <button onClick={clearAll} className={styles.clear}>
          Clear filters
        </button>
      )}
    </div>
  );
}
