"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import AddBrandForm from "@/components/brandsPage/AddBrandForm";
import BrandStats from "@/components/brandsPage/BrandStats";
import BrandList from "@/components/brandsPage/BrandList";

type brands = {
  id: string;
  brand_name: string;
  canonical_urls: string[];
  description: string;
  logo_url: string;
  competitors: string[];
};

export default function NewBrandPage() {

  const [brands, setBrands] = useState<brands[]>([]);
  const [brandsCount, setBrandsCount] = useState(0);
  const [queryCount, setQueryCount] = useState(0);
  const [activeQueryCount, setActiveQueryCount] = useState(0);
  const [visibility, setVisibility] = useState(72);

  const [fetchBrandsError, setFetchBrandsError] = useState<string | null>(null);
  const [brandsLoading, setBrandsLoading] = useState(false);

  useEffect(() => {
    setBrandsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE}/brands`, {
        withCredentials: true,
      })
      .then((res) => {
        setBrands(res.data);
        setBrandsCount(res.data.length);
      })
      .catch(() => setFetchBrandsError("Failed to load brands"))
      .finally(() => setBrandsLoading(false));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE}/queries`, {
        withCredentials: true,
      })
      .then((res) => {
        setQueryCount(res.data.length);
        const activeCount = res.data.filter((q: any) => q.is_active && !q.is_paused).length;
        setActiveQueryCount(activeCount);
      })
      .catch(() => setFetchBrandsError("Failed to load queries"));
  }, []);

  async function refreshBrands() {
    setBrandsLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/brands`, {
      withCredentials: true,
    })
      .then((res) => {
        setBrands(res.data);
        setBrandsCount(res.data.length);
      })
      .catch(() => setFetchBrandsError("Failed to load brands"))
      .finally(() => setBrandsLoading(false));
  }

  return (
    <main className="pt-28 sm:pt-0 space-y-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="lg:col-span-1">
          <AddBrandForm refreshBrands={refreshBrands} />
        </div>
        <div className="lg:col-span-1">
          <BrandStats brandsCount={brandsCount} queryCount={queryCount} activeQueryCount={activeQueryCount} visibility={visibility} />
        </div>
      </div>

      <div className="lg:col-span-2">
        <BrandList brands={brands} brandsLoading={brandsLoading} fetchError={fetchBrandsError} />
      </div>

    </main>
  );
}