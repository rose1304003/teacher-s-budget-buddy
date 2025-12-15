import { useEffect, useMemo, useRef, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import type { Allocation, Category } from "@/types/budget";

export function useAllocations(userId: string | null, month: string, categories: Category[]) {
  const [allocMap, setAllocMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const saveTimer = useRef<number | null>(null);

  async function load() {
    if (!userId) return;
    setLoading(true);
    const rows = await apiGet<Allocation[]>(`/api/allocations?user_id=${userId}&month=${month}`);
    const map: Record<string, number> = {};
    for (const r of rows) map[r.category_id] = Number(r.percent);
    setAllocMap(map);
    setLoading(false);
    setIsDirty(false);
  }

  useEffect(() => { load(); }, [userId, month]);

  const total = useMemo(() => {
    return categories
      .filter(c => c.is_active)
      .reduce((sum, c) => sum + (allocMap[c.id] ?? 0), 0);
  }, [categories, allocMap]);

  function setPercent(categoryId: string, percent: number) {
    setAllocMap(prev => ({ ...prev, [categoryId]: percent }));
    setIsDirty(true);

    // autosave (debounce 500ms)
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      if (!userId) return;
      try {
        await apiPost(`/api/allocations`, {
          user_id: userId,
          month,
          category_id: categoryId,
          percent,
        });
        setIsDirty(false);
      } catch {
        // keep dirty true so it warns if user tries to close
        setIsDirty(true);
      }
    }, 500);
  }

  return { allocMap, setPercent, total, loading, isDirty, reload: load };
}
