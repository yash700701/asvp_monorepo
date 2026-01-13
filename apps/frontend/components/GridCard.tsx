import { ReactNode } from "react";
import { HoverExpand_001 } from "./ui/skiper-ui/skiper52"

export default function GridCard() {

    const images = [
        {
        src: "/logo_with_bg.png",
        alt: "Illustrations by my fav AarzooAly",
        code: "# wkdjwq we  wfef kwef wejf wjehf wehfe wfh efhwe fjhwefkjw fkwe fke fkjwefg kwfgqwefgkew fgkwefgwe fgwef wefw fkwfwef e",
        },
        {
        src: "/logo_with_bg.png",
        alt: "Illustrations by my fav AarzooAly",
        code: "# 23",
        },
        {
        src: "/logo_with_bg.png",
        alt: "Illustrations by my fav AarzooAly",
        code: "# 23",
        },
        {
        src: "/logo_with_bg.png",
        alt: "Illustrations by my fav AarzooAly",
        code: "# 23",
        },
        {
        src: "/logo_with_bg.png",
        alt: "Illustrations by my fav AarzooAly",
        code: "# 23",
        },
        {
        src: "/logo_with_bg.png",
        alt: "Illustrations by my fav AarzooAly",
        code: "# 23",
        },
        {
        src: "/logo_with_bg.png",
        alt: "Illustrations by my fav AarzooAly",
        code: "# 23",
        },
    ];

    return (
        <div className="h-full w-full px-6 overflow-hidden bg-[#E8E8E3]">
            <div className="bg-[#171717] flex items-center justify-center w-full py-16 rounded-4xl">
                <HoverExpand_001 images={images} />
            </div>
        </div>
    );
}
