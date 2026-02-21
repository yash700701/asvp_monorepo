"use client";

import Loading from "../Loading";
import { ArrowRight } from "lucide-react";

type Brand = {
    id: string;
    brand_name: string;
    canonical_urls: string[];
    description: string;
    logo_url: string;
    competitors: string[];
};

type Props = {
    brands: Brand[];
    fetchError: string | null;
    brandsLoading: boolean;
    deletingId?: string | null;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
};

export default function BrandList({
    brands,
    fetchError,
    brandsLoading,
    deletingId,
    onDelete,
    onEdit,
}: Props) {
    return (
        <section className="space-y-4 w-full">
            <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">Your Brands</h2>
                {brandsLoading && <Loading />}
            </div>

            <div className="border rounded divide-y">

                {/* Empty State */}
                {brands.length === 0 && !fetchError && (
                    <p className="p-4 text-sm text-gray-500">
                        No brands found. Add your first brand to start tracking AI visibility.
                    </p>
                )}

                {/* Error State */}
                {fetchError && (
                    <p className="p-4 text-sm text-red-500">
                        Error loading brands: {fetchError}
                    </p>
                )}

                {/* Brand List */}
                {brands.map((brand) => (
                    <div
                        key={brand.id}
                        className="p-4 text-sm flex items-start justify-between gap-4"
                    >
                        {/* Left Section */}
                        <div>
                            <div className="flex items-center gap-3">
                                {brand.logo_url ? (
                                    <img
                                        src={brand.logo_url}
                                        alt={brand.brand_name}
                                        className="w-8 h-8 rounded object-cover border"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs font-medium">
                                        {brand.brand_name[0]}
                                    </div>
                                    
                                )}

                                <span className="font-medium flex items-center gap-3">
                                    {brand.brand_name}
                                    <button className="cursor-pointer">
                                        <ArrowRight size={16} />
                                    </button>
                                </span>
                            </div>

                            <div className="text-xs text-gray-500 mt-1 space-x-2">
                                <span>
                                    {brand.canonical_urls.length} URL
                                    {brand.canonical_urls.length !== 1 && "s"}
                                </span>

                                {brand.competitors?.length > 0 && (
                                    <>
                                        <span>|</span>
                                        <span>
                                            {brand.competitors.length} competitor
                                            {brand.competitors.length !== 1 && "s"}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-end justify-end gap-2 flex-wrap">
                            <button
                                onClick={() => onEdit?.(brand.id)}
                                className="text-xs px-3 py-1 rounded border border-gray-400 hover:bg-gray-100 transition"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => onDelete?.(brand.id)}
                                disabled={deletingId === brand.id}
                                className="text-xs px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                            >
                                {deletingId === brand.id ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}