import { HoverExpand_001 } from "./ui/skiper/skiper52";
import { HoverExpand_002 } from "./ui/skiper/skiper53";

export default function GridCard() {
    const images = [
        {
            src: "/logo_with_bg.png",
            alt: "Illustrations by my fav AarzooAly",
            code: "# wkdjwq we wfef kwef wejf wjehf wehfe wfh efhwe fjhwefkjw fkwe",
        },
        { src: "/logo_with_bg.png", alt: "Illustrations", code: "# 23" },
        { src: "/logo_with_bg.png", alt: "Illustrations", code: "# 23" },
        { src: "/logo_with_bg.png", alt: "Illustrations", code: "# 23" },
        { src: "/logo_with_bg.png", alt: "Illustrations", code: "# 23" },
        { src: "/logo_with_bg.png", alt: "Illustrations", code: "# 23" },
        { src: "/logo_with_bg.png", alt: "Illustrations", code: "# 23" },
    ];

    return (
        <div className="h-full w-full px-3 sm:px-6 overflow-hidden bg-[#E8E8E3]">
            <div className=" flex items-center justify-center w-full py-16 rounded-4xl">

                {/* Desktop */}
                <div className="hidden justify-center md:flex w-full">
                    <HoverExpand_001 images={images} />
                </div>

                {/* Mobile */}
                <div className="block md:hidden w-full">
                    <HoverExpand_002 images={images} />
                </div>

            </div>
        </div>
    );
}
