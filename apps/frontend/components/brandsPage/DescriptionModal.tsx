"use client";

export default function DescriptionModal({
    description,
    onClose
}: {
    description: string
    onClose: () => void
}) {
    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-125 relative shadow-lg">

                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-lg font-semibold mb-3">
                    Brand Description
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                </p>

            </div>
        </div>
    )
}