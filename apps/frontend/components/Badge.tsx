export function Badge({
    label,
    color = "gray"
}: {
    label: string;
    color?: "red" | "yellow" | "green" | "blue" | "gray" | "purple";
}) {
    const colors: Record<string, string> = {
        red: "bg-red-100 text-red-700",
        yellow: "bg-yellow-100 text-yellow-800",
        green: "bg-green-100 text-green-700",
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
        gray: "bg-gray-100 text-gray-700"
    };

    return (
        <span
        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}
        >
        {label}
        </span>
    );
}
