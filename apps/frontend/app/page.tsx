// import { fetchJSON } from "../lib/api";
import Hero from "./components/hero";
import FloatingCardsSection from "./components/FloatingCardsSection";
import Header from "./components/header";

export default async function Dashboard() {
  // const visibility = await fetchJSON<any[]>(
  //   "/analytics/visibility"
  // );

  // const sov = await fetchJSON<any[]>(
  //   "/analytics/share-of-voice"
  // );

  return (
    
    <main className="">
      <Header />
      <Hero />
      <FloatingCardsSection />

      <h1 className="text-2xl font-bold">
        AI Search Visibility Dashboard
      </h1>

      <section>
        <h2 className="text-lg font-semibold">
          Latest Visibility
        </h2>
        <pre className="bg-gray-100 p-4 rounded">
          {/* {JSON.stringify(visibility.slice(0, 3), null, 2)} */}
        </pre>
      </section>

      <section>
        <h2 className="text-lg font-semibold">
          Share of Voice
        </h2>
        <pre className="bg-gray-100 p-4 rounded">
          {/* {JSON.stringify(sov.slice(0, 3), null, 2)} */}
        </pre>
      </section>
    </main>
  );
}
