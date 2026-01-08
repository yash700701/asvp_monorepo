import GridCard from "./GridCard";
import Hero from "./hero";

export default function FloatingGridSection() {
    return (
        <section className="relative bg-white py-32">
        <div className="mx-auto max-w-7xl">
            <div className="grid-layout">
            <GridCard area="a">
                <div className="h-full w-full flex flex-col justify-center items-center bg-gray-100 p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">
                    Card A
                </h2>
                <p className="text-lg">
                    This is a sample card in area A.
                </p>
                </div>
            </GridCard>
            <GridCard area="b">
                <div className="h-full w-full flex flex-col justify-center items-center bg-gray-100 p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">
                    Card B
                </h2>
                <p className="text-lg">
                    This is a sample card in area B.
                </p>
                </div>
            </GridCard>
            <GridCard area="c" >
                <div className="h-full w-full flex flex-col justify-center items-center bg-gray-100 p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">
                    Card C
                </h2>
                <p className="text-lg">
                    This is a sample card in area C.
                </p>
                </div>
            </GridCard>
            <GridCard area="d" />

            <GridCard area="feature" large>
                <div className="h-full w-full flex flex-col justify-center items-center bg-lime-900 text-zinc-50 p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">
                    Featured Card
                </h2>
                <p className="text-lg">
                    This is a larger card that spans multiple grid areas.
                </p>
                </div>
            </GridCard>

            <GridCard area="e" />
            <GridCard area="f" />
            <GridCard area="g" />
            </div>
        </div>
        </section>
    );
}
