"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AddQueryForm from "@/components/queryPage/AddQueryForm";
import QueryList from "@/components/queryPage/QueryList";

type Query = {
    id: string;
    query_text: string;
    frequency: string;
    brand_id: string;
    query_type: "brand" | "category" | "competitor";
    created_at: string;
    is_active: boolean;
    is_paused: boolean;
};

export default function NewQueryPage() {
    const [brands, setBrands] = useState<any[]>([]);
    const [queries, setQueries] = useState<Query[]>([]);

    const [success, setSuccess] = useState<string | null>(null);
    const [pausingId, setPausingId] = useState<string | null>(null);
    const [unschedulingId, setUnschedulingId] = useState<string | null>(null);
    const [runningId, setRunningId] = useState<string | null>(null);
    const [queriesLoading, setQueriesLoading] = useState(false);
    const [queryError, setQueryError] = useState<string | null>(null);
    const [filterBrandId, setFilterBrandId] = useState("");
    const [activatingId, setActivatingId] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_BASE}/brands`, {
                withCredentials: true,
            })
            .then((res) => setBrands(res.data))
            .catch(() => setQueryError("Failed to load brands"));
    }, []);

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

    async function refreshQueries() {
        const url = filterBrandId
            ? `${process.env.NEXT_PUBLIC_API_BASE}/queries?brand_id=${filterBrandId}`
            : `${process.env.NEXT_PUBLIC_API_BASE}/queries`;

        const res = await axios.get(url, { withCredentials: true });
        setQueries(res.data);
    }

    async function activateQuery(queryId: string) {
        setActivatingId(queryId);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE}/queries/${queryId}/auto-schedule`,
                {},
                { withCredentials: true }
            );
            await refreshQueries();
        } catch (err: any) {
            alert(
                err.response?.data?.error ||
                    err.response?.data?.message ||
                    "Failed to activate query"
            );
        } finally {
            setActivatingId(null);
        }
    }

    async function runOnce(queryId: string) {
        setRunningId(queryId);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE}/queries/${queryId}/manual-run`,
                {},
                { withCredentials: true }
            );

            setSuccess("Query executed successfully");
            setTimeout(() => setSuccess(null), 2000);
        } catch (err: any) {
            alert(
                err.response?.data?.error ||
                    err.response?.data?.message ||
                    "Failed to run query"
            );
        } finally {
            setRunningId(null);
        }
    }

    async function pauseQuery(queryId: string) {
        setPausingId(queryId);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE}/queries/${queryId}/pause`,
                {},
                { withCredentials: true }
            );
            await refreshQueries();
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to pause query");
        } finally {
            setPausingId(null);
        }
    }

    async function resumeQuery(queryId: string) {
        setPausingId(queryId);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE}/queries/${queryId}/resume`,
                {},
                { withCredentials: true }
            );
            await refreshQueries();
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to resume query");
        } finally {
            setPausingId(null);
        }
    }

    async function unscheduleQuery(queryId: string) {
        if (
            !confirm("Unschedule this query? It will stop running automatically.")
        ) {
            return;
        }

        setUnschedulingId(queryId);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE}/queries/${queryId}/unschedule`,
                {},
                { withCredentials: true }
            );
            await refreshQueries();
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to unschedule query");
        } finally {
            setUnschedulingId(null);
        }
    }

    return (
        <main className="pt-28 sm:pt-0 space-y-8">
            <AddQueryForm brands={brands} onCreated={refreshQueries} />
            <QueryList
                brands={brands}
                queries={queries}
                queriesLoading={queriesLoading}
                queryError={queryError}
                filterBrandId={filterBrandId}
                runningId={runningId}
                pausingId={pausingId}
                activatingId={activatingId}
                unschedulingId={unschedulingId}
                onFilterBrandChange={setFilterBrandId}
                onRunOnce={runOnce}
                onActivate={activateQuery}
                onPause={pauseQuery}
                onResume={resumeQuery}
                onUnschedule={unscheduleQuery}
            />
            {success && (
                <div className="border border-green-300 bg-green-50 px-3 py-1.5 text-xs text-green-700 rounded">
                    {success}
                </div>
            )}
        </main>
    );
}
