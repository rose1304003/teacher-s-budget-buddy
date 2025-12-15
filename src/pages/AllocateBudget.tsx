import { useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useAllocations } from "@/hooks/useAllocations";

export default function AllocateBudgetPage() {
  const { userId, active, categories, loading, monthKey } = useCategories("expense");
  const month = monthKey(new Date());
  const { allocMap, setPercent, total, isDirty } = useAllocations(userId, month, categories);

  // prevent closing if dirty (but autosave should make dirty rare)
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  if (loading) return <div className="p-4">Loading…</div>;

  const remaining = Math.max(0, 100 - total);

  return (
    <div className="p-4 space-y-4">
      <div className="text-3xl font-bold text-purple-300">Allocate Budget</div>
      <div className="opacity-70">Distribute your income across categories</div>

      <div className="rounded-2xl p-4 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Budget Allocation</div>
          <div className="font-semibold text-purple-300">{Math.round(total)}% / 100%</div>
        </div>
        <div className="mt-2 text-sm opacity-70">{Math.round(remaining)}% remaining to allocate</div>
      </div>

      {active.map(cat => {
        const val = allocMap[cat.id] ?? 0;
        return (
          <div key={cat.id} className="rounded-2xl p-4 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xl">{cat.icon ?? "📌"}</div>
                <div>
                  <div className="font-semibold">{cat.name}</div>
                  <div className="text-sm opacity-70">Monthly allocation</div>
                </div>
              </div>
              <div className="font-semibold text-yellow-300">{Math.round(val)}%</div>
            </div>

            <input
              className="w-full mt-3"
              type="range"
              min={0}
              max={100}
              value={val}
              onChange={(e) => setPercent(cat.id, Number(e.target.value))}
            />
            <div className="flex justify-between text-xs opacity-60 mt-1">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>
        );
      })}

      <button
        disabled={Math.round(total) !== 100}
        className="w-full rounded-2xl py-3 font-semibold bg-purple-500 disabled:opacity-40"
      >
        {Math.round(total) === 100 ? "Saved ✅" : `Allocate More ${Math.round(remaining)}%`}
      </button>

      {isDirty && (
        <div className="text-xs opacity-70">Saving…</div>
      )}
    </div>
  );
}
