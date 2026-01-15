"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NewBrandPage() {
  const [name, setName] = useState("");
  const [urls, setUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function submit() {
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/brands`,
        {
          brand_name: name,
          canonical_urls: urls
            .split("\n")
            .map((u) => u.trim())
            .filter(Boolean),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
        
        console.log("Brand created:", res.data);

    //   router.push("/");
    } catch (err: any) {
      // Axios error handling
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || err.response?.data?.message || "Failed to create brand"
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Add Brand</h1>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-medium">Brand name</label>
        <input
          className="w-full border rounded p-2 mt-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Canonical URLs (one per line)</label>
        <textarea
          className="w-full border rounded p-2 mt-1"
          rows={4}
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          disabled={loading}
        />
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="bg-black text-white cursor-pointer px-4 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Saving..." : "Create Brand"}
      </button>
    </main>
  );
}
