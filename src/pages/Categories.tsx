import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const { categories, loading, addCategory, renameCategory, toggleCategory } = useCategories("expense");
  const [name, setName] = useState("");

  if (loading) return <div className="p-4">Loading…</div>;

  return (
    <div className="p-4 space-y-4">
      <button
        className="w-full rounded-2xl py-3 font-semibold bg-emerald-400 text-black"
        onClick={() => {
          const n = prompt("Category name?");
          if (n) addCategory(n);
        }}
      >
        + Add Category
      </button>

      <div className="rounded-2xl p-3 bg-black/30">
        <div className="font-semibold mb-2">Expense Categories</div>

        <div className="space-y-2">
          {categories.map(c => (
            <div key={c.id} className="flex items-center justify-between rounded-2xl p-3 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="text-xl">{c.icon ?? "📌"}</div>
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs opacity-60">{c.is_default ? "Default Category" : "Custom Category"}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 rounded-xl bg-blue-500/30"
                  onClick={() => {
                    const n = prompt("Rename category", c.name);
                    if (n && n.trim()) renameCategory(c.id, n.trim());
                  }}
                >
                  ✏️
                </button>

                <button
                  className="px-3 py-2 rounded-xl bg-white/10"
                  onClick={() => toggleCategory(c.id, !c.is_active)}
                  title={c.is_active ? "Hide" : "Show"}
                >
                  {c.is_active ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
