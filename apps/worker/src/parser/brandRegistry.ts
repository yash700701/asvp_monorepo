export type CanonicalEntity = {
    id: string;
    canonical_name: string;
    type: "Brand" | "Company" | "Product";
    aliases: string[];
};

export const BRAND_REGISTRY: CanonicalEntity[] = [
    {
        id: "brand_uber",
        canonical_name: "Uber",
        type: "Brand",
        aliases: [
            "uber",
            "uber inc",
            "uber technologies",
            "uber technologies inc"
        ]
    },
    {
        id: "brand_ola",
        canonical_name: "Ola",
        type: "Brand",
        aliases: [
            "ola",
            "ola cabs",
            "ani technologies"
        ]
    }
];
