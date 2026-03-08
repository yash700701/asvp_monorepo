"use client";

import { useEffect, useState } from "react";

type Brand = {
    id: string;
    brand_name: string;
    canonical_urls: string[];
    description: string;
    logo_url: string;
    competitors: string[];
};

type Props = {
    brand: Brand;
    saving: boolean;
    onClose: () => void;
    onSave: (payload: {
        brand_name: string;
        canonical_urls: string[];
        description: string;
        logo_url: string;
        competitors: string[];
    }) => void;
};

export default function EditBrandModal({ brand, saving, onClose, onSave }: Props) {
    const [brandName, setBrandName] = useState(brand.brand_name || "");
    const [canonicalUrlsText, setCanonicalUrlsText] = useState((brand.canonical_urls || []).join(", "));
    const [description, setDescription] = useState(brand.description || "");
    const [logoUrl, setLogoUrl] = useState(brand.logo_url || "");
    const [competitorsText, setCompetitorsText] = useState((brand.competitors || []).join(", "));

    useEffect(() => {
        setBrandName(brand.brand_name || "");
        setCanonicalUrlsText((brand.canonical_urls || []).join(", "));
        setDescription(brand.description || "");
        setLogoUrl(brand.logo_url || "");
        setCompetitorsText((brand.competitors || []).join(", "));
    }, [brand]);

    function submit() {
        onSave({
            brand_name: brandName.trim(),
            canonical_urls: canonicalUrlsText.split(",").map((v) => v.trim()).filter(Boolean),
            description: description.trim(),
            logo_url: logoUrl.trim(),
            competitors: competitorsText.split(",").map((v) => v.trim()).filter(Boolean),
        });
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">Edit Brand</h3>
                    <button onClick={onClose} className="text-sm text-gray-600 hover:text-black">
                        Close
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <label className="space-y-1">
                        <span className="text-gray-600">Brand Name</span>
                        <input
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="w-full border rounded px-2 py-1.5"
                        />
                    </label>

                    <label className="space-y-1">
                        <span className="text-gray-600">Logo URL</span>
                        <input
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            className="w-full border rounded px-2 py-1.5"
                        />
                    </label>

                    <label className="space-y-1 md:col-span-2">
                        <span className="text-gray-600">Canonical URLs (comma separated)</span>
                        <input
                            value={canonicalUrlsText}
                            onChange={(e) => setCanonicalUrlsText(e.target.value)}
                            className="w-full border rounded px-2 py-1.5"
                        />
                    </label>

                    <label className="space-y-1 md:col-span-2">
                        <span className="text-gray-600">Competitors (comma separated)</span>
                        <input
                            value={competitorsText}
                            onChange={(e) => setCompetitorsText(e.target.value)}
                            className="w-full border rounded px-2 py-1.5"
                        />
                    </label>

                    <label className="space-y-1 md:col-span-2">
                        <span className="text-gray-600">Description</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded px-2 py-1.5 min-h-24"
                        />
                    </label>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={saving || !brandName.trim()}
                        className="px-3 py-1.5 text-sm rounded border border-black bg-black text-white hover:opacity-90 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

