// import { fetchJSON } from "../lib/api";
import Hero from "../components/hero";
import GridCard from "@/components/GridCard";
import Header from "../components/header";

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
      <GridCard />

    </main>
  );
}
