"use client"

import { useEffect, useState } from "react";
import Hero from "../components/hero";
import GridCard from "@/components/GridCard";
import Header from "../components/header";
import { requireAuth } from "../lib/requireAuth";
import api from "../lib/axios";

export default function Dashboard() {
  // const user = await requireAuth();

  const [visibility, setVisibility] = useState<any[]>([]);
  const [sov, setSov] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [visibilityRes, sovRes] = await Promise.all([
          api.get("/analytics/visibility"),
          api.get("/analytics/share-of-voice"),
        ]);

        setVisibility(visibilityRes.data);
        setSov(sovRes.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    
    <main className="">
      <Header />
      <Hero />
      <GridCard />

      <div className="">
        <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          AI Search Visibility Dashboard
        </h1>

        <h1 className="text-2xl font-bold">
          {/* Welcome, {user.email} */}
        </h1>

        <section>
          <h2 className="text-lg font-semibold">
            Latest Visibility
          </h2>
          <pre className=" p-4 rounded">
            {JSON.stringify(visibility.slice(0, 3), null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold">
            Share of Voice
          </h2>
          <pre className="p-4 rounded">
            {JSON.stringify(sov.slice(0, 3), null, 2)}
          </pre>
        </section>
      </main>
      </div>

    </main>
  );
}
