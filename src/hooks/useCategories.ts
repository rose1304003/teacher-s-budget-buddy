import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Category } from "@/types/budget";

function monthKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function useCategories(type: "expense" | "income" = "expense") {
  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id ?? null;
      setUserId(uid);
    })();
  }, []);

  async function load() {
    if (!userId) return;
    setLoading(true);

    // seed default categories if empty
    await apiPost(`/api/categories/seed-defaults?user_id=${userId}`, {});

    const list = await apiGet<Category[]>(`/api/categories?user_id=${userId}&type=${type}`);
    setCategories(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, [userId, type]);

  async function addCategory(name: string, icon?: string) {
    if (!userId) return;
    await apiPost(`/api/categories`, {
      user_id: userId,
      name,
      type,
      icon: icon ?? null,
      is_default: false,
      is_active: true,
    });
    await load();
  }

  async function renameCategory(id: string, name: string) {
    if (!userId) return;
    await apiPatch(`/api/categories/${id}?user_id=${userId}`, { name });
    await load();
  }

  async function toggleCategory(id: string, isActive: boolean) {
    if (!userId) return;
    await apiPatch(`/api/categories/${id}?user_id=${userId}`, { is_active: isActive });
    await load();
  }

  const active = useMemo(() => categories.filter(c => c.is_active), [categories]);

  return { userId, categories, active, loading, addCategory, renameCategory, toggleCategory, monthKey };
}
