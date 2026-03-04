"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/shadcn/card";
import { AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";

type RunRow = {
  created_at: string;
  visibility_score: number;
  trust: number;
  sentiment: number;
  brandPresence: number;
};

export default function VisibilityOverview({ brandId }: { brandId: string }) {
  const [data, setData] = useState<RunRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = axios.get(`http://localhost:4000/dashboard/visibility-overview?brandId=${brandId}`, {
          withCredentials: true,
        });
        const json = (await res).data;
        setData(json.data || []);
      } catch (error) {
        console.error("Error fetching visibility overview data:", error); 
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [brandId]);

  if (loading) {
    return <div className="p-8 text-sm text-muted-foreground">Loading visibility data...</div>;
  }

  if (!data.length) {
    return <div className="p-8 text-sm text-muted-foreground">No visibility runs available yet.</div>;
  }

  const sorted = [...data].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const current = sorted[sorted.length - 1]?.visibility_score ?? 0;

  const last7 = sorted.slice(-7);
  const avg7 =
    last7.reduce((acc, cur) => acc + (cur.visibility_score || 0), 0) /
    (last7.length || 1);

  const previous7 = sorted.slice(-14, -7);
  const prevAvg =
    previous7.reduce((acc, cur) => acc + (cur.visibility_score || 0), 0) /
    (previous7.length || 1);

  const change = prevAvg ? ((avg7 - prevAvg) / prevAvg) * 100 : 0;

  const last10 = sorted.slice(-10);
  const firstOfLast10 = last10[0]?.visibility_score ?? 0;
  const lastOfLast10 = last10[last10.length - 1]?.visibility_score ?? 0;
  const dropPercent = firstOfLast10
    ? ((firstOfLast10 - lastOfLast10) / firstOfLast10) * 100
    : 0;

  const formatData = sorted.map((d, i) => ({
    index: i + 1,
    visibility: d.visibility_score,
    trust: d.trust,
    sentiment: d.sentiment,
    brandPresence: d.brandPresence
  }));

  return (
    <div className="space-y-8">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            AI Visibility Overview (Last 100 Runs)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" hide />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visibility"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Current</p>
              <p className="text-2xl font-bold">{current.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">7-run Avg</p>
              <p className="text-2xl font-bold">{avg7.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Change</p>
              <p
                className={`text-2xl font-bold ${change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {change >= 0 ? "+" : ""}
                {change.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Metric Stability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { key: "trust", label: "Trust" },
            { key: "sentiment", label: "Sentiment" },
            { key: "brandPresence", label: "Brand Presence" }
          ].map(metric => (
            <div key={metric.key} className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm font-medium col-span-1">{metric.label}</p>
              <div className="col-span-3 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formatData}>
                    <Area
                      type="monotone"
                      dataKey={metric.key}
                      strokeWidth={2}
                      fillOpacity={0.1}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {dropPercent > 10 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-2xl border border-red-200 bg-red-50 shadow-sm">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-sm font-medium text-red-700">
                Visibility dropped {dropPercent.toFixed(0)}% in last 10 runs.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}