import { ReactNode } from "react";

type GridCardProps = {
    area: string;
    large?: boolean;
    children?: ReactNode;
};

export default function GridCard({ area, large, children }: GridCardProps) {
    return (
        <div
        className={`grid-card ${large ? "grid-card--large" : ""}`}
        style={{ gridArea: area }}
        >
        {children}
        </div>
    );
}
