"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/Loading";

type Query = {
  id: string;
  query_text: string;
  frequency: string;
  brand_id: string;
  query_type: "brand" | "category" | "competitor";
  created_at: string;
  is_active: boolean;
};

export default function NewQueryPage() {
  const router = useRouter();

  /* ---------- Form state ---------- */
  const [queryText, setQueryText] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [queryType, setQueryType] = useState<"brand" | "category" | "competitor">("category");
  const [brandId, setBrandId] = useState("");
  const [loading, setLoading] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);

  /* ---------- Data ---------- */
  const [brands, setBrands] = useState<any[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [filterBrandId, setFilterBrandId] = useState("");
  const [activatingId, setActivatingId] = useState<string | null>(null);

  /* ---------- UX ---------- */
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------- Fetch brands ---------- */
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE}/brands`, {
        withCredentials: true,
      })
      .then((res) => setBrands(res.data))
      .catch(() => setError("Failed to load brands"));
  }, []);

  /* ---------- Fetch queries (all or by brand) ---------- */
  useEffect(() => {
    const fetchQueries = async () => {
      setQueriesLoading(true);
      setQueryError(null);

      try {
        const url = filterBrandId
          ? `${process.env.NEXT_PUBLIC_API_BASE}/queries?brand_id=${filterBrandId}`
          : `${process.env.NEXT_PUBLIC_API_BASE}/queries`;

        const res = await axios.get(url, { withCredentials: true });
        setQueries(res.data);
      } catch {
        setQueryError("Failed to load queries");
      } finally {
        setQueriesLoading(false);
      }
    };

    fetchQueries();
  }, [filterBrandId]);

  /* ---------- Submit query ---------- */
  async function submit() {
    setError(null);
    setSuccess(null);

    if (!brandId) return setError("Please select a brand");
    if (!queryText.trim()) return setError("Query text cannot be empty");

    setLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/queries`,
        {
          brand_id: brandId,
          query_text: queryText,
          query_type: queryType,
          frequency,
        },
        { withCredentials: true }
      );

      setSuccess("Query created successfully");

      // reset form
      setQueryText("");
      setFrequency("daily");
      setQueryType("category");

      // refresh queries list
      setFilterBrandId("");
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || err.response?.data?.message || "Failed to create query"
        );
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Activate query ---------- */
  async function activateQuery(queryId: string) {
    setActivatingId(queryId);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/queries/${queryId}/auto-schedule`,
        {},
        { withCredentials: true }
      );

      // refresh queries
      const url = filterBrandId
        ? `${process.env.NEXT_PUBLIC_API_BASE}/queries?brand_id=${filterBrandId}`
        : `${process.env.NEXT_PUBLIC_API_BASE}/queries`;

      const res = await axios.get(url, { withCredentials: true });
      setQueries(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || "Failed to activate query");
    } finally {
      setActivatingId(null);
    }
  }

  /* ---------- Run query once ---------- */
  async function runOnce(queryId: string) {
    setRunningId(queryId);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/queries/${queryId}/manual-run`,
        {},
        { withCredentials: true }
      );

      // optional toast / UX
      setSuccess("Query executed successfully");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || "Failed to run query");
    } finally {
      setRunningId(null);
    }
  }

  return (
    <main className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ================= LEFT: FORM ================= */}
      <section className="space-y-4">
        <h1 className="text-xl font-bold">Add Query</h1>

        {error && (
          <div className="border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Brand */}
        <div>
          <label className="text-sm font-medium">Brand</label>
          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            disabled={loading}
          >
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.brand_name}
              </option>
            ))}
          </select>
        </div>

        {/* Query type */}
        <div>
          <label className="text-sm font-medium">Query type</label>
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value as "brand" | "category" | "competitor")}
            className="w-full border rounded p-2 mt-1"
          >
            <option value="brand">Brand</option>
            <option value="category">Category</option>
            <option value="competitor">Competitor</option>
          </select>
        </div>

        {/* Query text */}
        <div>
          <label className="text-sm font-medium">Query text</label>
          <input
            className="w-full border rounded p-2 mt-1"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="e.g. best bike rental app"
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="text-sm font-medium">Frequency</label>
          <select
            className="w-full border rounded p-2 mt-1"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create Query"}
        </button>
      </section>

      {/* ================= RIGHT: QUERIES ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">Queries</h2>
            {queriesLoading && <Loading />}
          </div>

          {/* Filter by brand */}
          <select
            value={filterBrandId}
            onChange={(e) => setFilterBrandId(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.brand_name}
              </option>
            ))}
          </select>
        </div>

        <div className="border rounded divide-y">
          {!queriesLoading && queries.length === 0 && (
            <p className="p-4 text-sm text-gray-500">No queries found</p>
          )}
          {queryError && (
            <p className="p-4 text-sm text-red-500">Error loading queries: {queryError}</p>
          )}

          {queries.map((q) => (
            <div key={q.id} className="p-4 text-sm flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{q.query_text}</span>

                  {q.is_active && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      Active
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  {q.frequency} · {q.query_type}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Run once */}
                <button
                  onClick={() => runOnce(q.id)}
                  disabled={runningId === q.id}
                  className="text-xs px-3 py-1 rounded border border-gray-400 hover:bg-gray-100 transition disabled:opacity-50"
                >
                  {runningId === q.id ? "Running..." : "Run once"}
                </button>

                {/* Activate (only if inactive) */}
                {!q.is_active && (
                  <button
                    onClick={() => activateQuery(q.id)}
                    disabled={activatingId === q.id}
                    className="text-xs px-3 py-1 rounded border border-black hover:bg-black hover:text-white transition disabled:opacity-50"
                  >
                    {activatingId === q.id ? "Activating..." : "Activate"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
