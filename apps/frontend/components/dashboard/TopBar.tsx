"use client"

import { useState } from "react"
import { Download, ChevronDown } from "lucide-react"

type Brand = {
    id: string
    name: string
}

export default function TopBar() {
    // Mock brands (replace later with API)
    const brands: Brand[] = [
        { id: "1", name: "Zepto" },
        { id: "2", name: "Apple" },
        { id: "3", name: "Uber" },
    ]

    const [selectedBrand, setSelectedBrand] = useState<Brand>(brands[0])
    const [showBrandDropdown, setShowBrandDropdown] = useState(false)

    const [dateRange, setDateRange] = useState("Last 7 days")
    const [showDateDropdown, setShowDateDropdown] = useState(false)

    const dateOptions = [
        "Last 7 days",
        "Last 30 days",
        "Last 90 days",
        "This Month",
        "Custom Range",
    ]

    const handleExport = () => {
        alert(`Exporting data for ${selectedBrand.name} (${dateRange})`)
    }

    return (
        <div className="flex items-center justify-between border-b bg-white px-8 py-4">

            {/* LEFT - Brand Selector */}
            <div className="relative">
                <button
                    onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition"
                >
                    {selectedBrand.name}
                    <ChevronDown size={16} />
                </button>

                {showBrandDropdown && (
                    <div className="absolute mt-2 w-48 bg-white border rounded-xl shadow-lg z-50">
                        {brands.map((brand) => (
                            <button
                                key={brand.id}
                                onClick={() => {
                                    setSelectedBrand(brand)
                                    setShowBrandDropdown(false)
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-xl"
                            >
                                {brand.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

                {/* Date Range */}
                <div className="relative">
                    <button
                        onClick={() => setShowDateDropdown(!showDateDropdown)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition"
                    >
                        {dateRange}
                        <ChevronDown size={16} />
                    </button>

                    {showDateDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50">
                            {dateOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        setDateRange(option)
                                        setShowDateDropdown(false)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-xl"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Export Button */}
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-xl text-sm font-medium hover:opacity-90 transition"
                >
                    <Download size={16} />
                    Export
                </button>

            </div>
        </div>
    )
}